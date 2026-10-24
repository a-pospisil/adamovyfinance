import test from "node:test";
import assert from "node:assert/strict";

import { businessCaseName, describeRaynetResult, normalizePhone, syncInquiryToRaynet, type Inquiry } from "../raynet";

/** Falešné Raynet API: odpovědi podle metody a cesty, zapsané požadavky v `calls`. */
type Call = { method: string; path: string; query: URLSearchParams; body?: Record<string, unknown> };

const ADAM = 193;
const ENV = {
  RAYNET_API_KEY: "key",
  RAYNET_USERNAME: "adam",
  RAYNET_INSTANCE_NAME: "test",
  RAYNET_OWNER_ID: String(ADAM),
  RAYNET_CONTACT_SOURCE_ID: "79",
} as unknown as NodeJS.ProcessEnv;
/** Pondělí 26. 10. 2026 8:00 v Praze (UTC+1). */
const NOW = Date.parse("2026-10-26T07:00:00Z");

const inquiry: Inquiry = {
  name: "Jan Testovací",
  phone: "777 123 456",
  email: "jan+web@example.cz",
  topic: "Investiční hypotéka",
  message: "Dobrý den",
};

function client(id: number, email: string, tel1 = "+420777123456") {
  // Vlastník klienta je kolega – OP ani úkol na něj na tomhle webu nejdou.
  return { id, owner: { id: 13 }, primaryAddress: { contactInfo: { email, tel1 } } };
}

function fakeRaynet(data: { companies?: unknown[]; businessCases?: unknown[] }) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    const path = url.pathname.replace("/api/v2/", "");
    const method = init?.method ?? "GET";
    const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : undefined;
    calls.push({ method, path, query: url.searchParams, body });
    const ok = (payload: object) => new Response(JSON.stringify({ success: true, ...payload }), { status: 200 });
    if (method === "GET" && path === "company/") return ok({ data: data.companies ?? [] });
    if (method === "GET" && path === "businessCase/") return ok({ data: data.businessCases ?? [] });
    if (method === "GET" && path === "activity/") return ok({ data: [] });
    if (method === "PUT") return ok({ data: { id: 900 + calls.length } });
    if (method === "POST") return ok({});
    return new Response("{}", { status: 404 });
  }) as typeof fetch;
  const write = (method: string, path: string) => calls.find((c) => c.method === method && c.path === path);
  return { calls, fetchImpl, write };
}

test("normalizePhone sjednotí předvolbu i mezery", () => {
  assert.equal(normalizePhone("+420 777 123 456"), "777123456");
  assert.equal(normalizePhone("00420777123456"), "777123456");
  assert.equal(normalizePhone("123"), null);
});

test("nový kontakt → lead + telefonát jako dřív", async () => {
  const fake = fakeRaynet({});
  const res = await syncInquiryToRaynet(inquiry, { env: ENV, now: NOW, fetch: fake.fetchImpl });
  assert.equal(res.status, "created");
  assert.ok(fake.write("PUT", "lead/"));
  assert.ok(fake.write("PUT", "phoneCall/"));
  assert.equal(fake.write("PUT", "businessCase/"), undefined);
});

test("existující klient (1 shoda) → žádný lead, OP + úkol vždy na Adama, klient beze změny", async () => {
  const fake = fakeRaynet({ companies: [client(476, "JAN+web@example.cz"), client(477, "jiny@example.cz", "+420600000000")] });
  const res = await syncInquiryToRaynet(inquiry, { env: ENV, now: NOW, fetch: fake.fetchImpl });

  assert.equal(res.status, "existingClient");
  assert.equal(fake.write("PUT", "lead/"), undefined);
  assert.equal(fake.write("PUT", "phoneCall/"), undefined);
  assert.ok(!fake.calls.some((c) => c.method !== "GET" && c.path.startsWith("company/")), "na Company se nic nezapisuje");

  const bc = fake.write("PUT", "businessCase/")!.body!;
  assert.equal(bc.name, "Web poptávka - Investiční hypotéka (adamovyfinance.cz)");
  assert.equal(bc.company, 476);
  assert.equal(bc.owner, ADAM);
  assert.equal(bc.businessCaseType, 64);
  assert.equal(bc.category, 116);
  assert.equal(bc.source, 79);
  assert.equal(bc.validFrom, "2026-10-26");

  const task = fake.write("PUT", "task/")!.body!;
  assert.equal(task.title, "Kontaktovat klienta - poptávka z webu (adamovyfinance.cz)");
  assert.equal(task.owner, ADAM);
  assert.equal(task.company, 476);
  assert.equal(task.businessCase, res.status === "existingClient" ? res.businessCaseId : -1);
  assert.equal(task.scheduledFrom, "2026-10-26T09:00:00.000+01:00");
  assert.equal(task.deadline, "2026-10-26T17:00:00.000+01:00");
  assert.match(describeRaynetResult(res)!, /existující klient #476 – lead se nezakládal/);
});

test("shoda jen podle telefonu, když e-mail nic nenajde", async () => {
  const fake = fakeRaynet({ companies: [client(476, "uplne-jiny@example.cz")] });
  const res = await syncInquiryToRaynet({ ...inquiry, email: "novy@example.cz" }, { env: ENV, now: NOW, fetch: fake.fetchImpl });
  assert.equal(res.status, "existingClient");
});

test("víc shod → lead jako dřív s upozorněním na možné duplicity", async () => {
  const fake = fakeRaynet({ companies: [client(476, "jan+web@example.cz"), client(480, "jan+web@example.cz")] });
  const res = await syncInquiryToRaynet(inquiry, { env: ENV, now: NOW, fetch: fake.fetchImpl });

  assert.equal(res.status, "created");
  assert.equal(fake.write("PUT", "businessCase/"), undefined);
  assert.match(String(fake.write("PUT", "lead/")!.body!.notice), /Možný duplicitní klient: ID 476, ID 480/);
  assert.match(describeRaynetResult(res)!, /možný duplicitní klient \(ID 476, ID 480\)/);
});

test("opakované odeslání do 24 h → žádný druhý OP ani úkol, jen doplněný popis", async () => {
  const name = businessCaseName(inquiry);
  const fake = fakeRaynet({
    companies: [client(476, "jan+web@example.cz")],
    businessCases: [{ id: 702, name, company: { id: 476 }, rowInfo: { createdAt: "2026-10-26T07:30:00+01:00" } }],
  });
  const res = await syncInquiryToRaynet(inquiry, { env: ENV, now: NOW, fetch: fake.fetchImpl });

  assert.deepEqual(res, { status: "existingClient", companyId: 476, businessCaseId: 702, repeated: true });
  assert.equal(fake.write("PUT", "businessCase/"), undefined);
  assert.equal(fake.write("PUT", "task/"), undefined);
  assert.ok(fake.write("POST", "businessCase/702/")!.body!.description);
});

test("OP ze stejného formuláře starší než 24 h → nový OP", async () => {
  const fake = fakeRaynet({
    companies: [client(476, "jan+web@example.cz")],
    businessCases: [{ id: 702, name: businessCaseName(inquiry), company: { id: 476 }, rowInfo: { createdAt: "2026-10-24T07:30:00+02:00" } }],
  });
  await syncInquiryToRaynet(inquiry, { env: ENV, now: NOW, fetch: fake.fetchImpl });
  assert.ok(fake.write("PUT", "businessCase/"));
});
