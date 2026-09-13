"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { DEEP_PAGES, NAV, SITE } from "@/lib/site";

/** Hlavička jako záhlaví tištěného dokumentu: monogram, jméno, tenká linka. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      data-theme="paper"
      className={`fixed inset-x-0 top-0 z-50 border-b text-ink transition-colors duration-500 ${
        scrolled || open ? "border-(--line) bg-paper" : "border-transparent bg-transparent"
      }`}
    >
      <a
        href="#obsah"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Přeskočit na obsah
      </a>

      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[4.75rem]">
        <Link href="/" className="tap flex items-baseline" aria-label="Adam Pospíšil — úvod">
          <span className="display whitespace-nowrap text-[1.35rem] leading-none tracking-[0.01em]">Adam Pospíšil</span>
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`label-sm whitespace-nowrap border-b pb-0.5 text-[0.68rem] tracking-[0.13em] transition-colors ${
                  active ? "border-burgundy text-burgundy" : "border-transparent text-ink/70 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/kontakt"
            className="label-sm inline-flex h-10 items-center whitespace-nowrap bg-ink px-5 text-[0.68rem] tracking-[0.13em] text-paper transition-colors hover:bg-burgundy"
          >
            Probrat financování
          </Link>
        </nav>

        <div className="flex items-center gap-4 lg:hidden">
          <a
            href={SITE.phoneHref}
            className="label-sm flex h-11 min-w-11 items-center justify-center gap-2 text-ink/80 transition-colors hover:text-ink sm:min-w-0 sm:justify-start"
            aria-label={`Zavolat na ${SITE.phone}`}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M4.5 2.5h3l1.5 4-2 1.2a10 10 0 0 0 5.3 5.3l1.2-2 4 1.5v3a1.5 1.5 0 0 1-1.7 1.5C8.5 16.4 3.6 11.5 3 5.2A1.5 1.5 0 0 1 4.5 2.5Z" />
            </svg>
            <span className="hidden sm:inline">Zavolat</span>
          </a>
        <button
          type="button"
          className="label-sm relative z-[60] -mr-1 flex h-11 items-center gap-3 px-1"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "Zavřít" : "Menu"}</span>
          <span aria-hidden="true" className="relative block h-2.5 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300 ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
        </div>
      </div>

      <div id={menuId} hidden={!open} className="fixed inset-0 top-16 z-50 overflow-y-auto bg-paper lg:hidden">
        <nav aria-label="Mobilní navigace" className="container-x flex min-h-full flex-col justify-center py-10">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-5 border-b border-(--line) py-4"
            >
              <span className="label-xs tabular">{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-[clamp(1.75rem,8vw,2.5rem)] leading-none">{item.label}</span>
            </Link>
          ))}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {DEEP_PAGES.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="label-sm tap text-ink/70">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <a href={SITE.phoneHref} className="display text-2xl">
              {SITE.phone}
            </a>
            <a href={SITE.instagram} className="label-sm tap text-ink/70" target="_blank" rel="noopener noreferrer">
              Instagram {SITE.instagramHandle}
            </a>
            <Link
              href="/kontakt"
              onClick={() => setOpen(false)}
              className="label-sm mt-4 inline-flex h-12 w-full items-center justify-center bg-ink text-paper"
            >
              Probrat financování
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
