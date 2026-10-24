/**
 * Překlad importních aliasů pro `node --test` (převzato z evergreen-finance-web).
 *
 * Node umí TypeScript spustit nativně (type stripping), ale o `paths` z
 * tsconfig.json nic neví — bez tohohle hooku by testy neuviděly nic, co
 * importuje přes `@/`. Nulová závislost navíc je záměr: testy
 * nemají mít vlastní build toolchain.
 *
 * Použití: `node --import ./scripts/register-alias.mjs --test …` (viz npm test).
 */
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = path.resolve(import.meta.dirname, "..", "src");
const EXTENSIONS = [".ts", ".tsx", ".mts", ".js"];

/** Doplní příponu / index soubor — TS importy je píšou bez nich, Node je vyžaduje. */
function resolveFile(base) {
  if (path.extname(base) && existsSync(base)) return base;
  for (const ext of EXTENSIONS) {
    if (existsSync(`${base}${ext}`)) return `${base}${ext}`;
  }
  for (const ext of EXTENSIONS) {
    const indexFile = path.join(base, `index${ext}`);
    if (existsSync(indexFile)) return indexFile;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const target = resolveFile(path.join(SRC, specifier.slice(2)));
      if (target) return nextResolve(pathToFileURL(target).href, context);
    }
    if ((specifier.startsWith("./") || specifier.startsWith("../")) && !path.extname(specifier)) {
      const parent = context.parentURL?.startsWith("file:") ? fileURLToPath(context.parentURL) : null;
      if (parent) {
        const target = resolveFile(path.resolve(path.dirname(parent), specifier));
        if (target) return nextResolve(pathToFileURL(target).href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
