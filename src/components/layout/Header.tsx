"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { NAV, SITE } from "@/lib/site";

/** Fixed header: transparent over the hero, solid ink after scrolling. Full-screen menu on mobile. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the menu is open.
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
      data-theme="dark"
      className={`fixed inset-x-0 top-0 z-50 text-ivory-100 transition-[background-color,border-color] duration-500 ${
        scrolled || open ? "bg-ink-950/95 border-b border-(--line)" : "bg-transparent border-b border-transparent"
      }`}
    >
      <a
        href="#obsah"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ivory-100 focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Přeskočit na obsah
      </a>
      <div className="container-x flex h-[4.5rem] items-center justify-between lg:h-20">
        <Link href="/" className="group flex items-center gap-3" aria-label="Adam Pospíšil – úvod">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center border border-(--line-strong) font-mono text-[0.7rem] tracking-[0.12em] transition-colors group-hover:border-ivory-100"
          >
            AP
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.95rem] font-semibold tracking-[-0.01em]">Adam Pospíšil</span>
            <span className="mt-1 hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] text-sand sm:block">
              Hypotéky · Investiční nemovitosti
            </span>
          </span>
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-[0.9rem] tracking-[-0.005em] transition-colors hover:text-ivory-50 ${
                  active ? "text-ivory-50" : "text-sand"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1.5 left-0 h-px bg-moss-300 transition-[width] duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
          <Link
            href="/kontakt"
            className="ml-2 inline-flex h-10 items-center rounded-[2px] bg-ivory-100 px-4 text-[0.875rem] font-medium text-ink-950 transition-opacity hover:opacity-90"
          >
            Probrat financování
          </Link>
        </nav>

        <button
          type="button"
          className="relative z-[60] -mr-2 flex h-11 items-center gap-3 px-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "Zavřít" : "Menu"}</span>
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span
              className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300 ${
                open ? "translate-y-[5.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300 ${
                open ? "-translate-y-[5.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="fixed inset-0 top-[4.5rem] z-50 flex flex-col bg-ink-950 lg:hidden"
      >
        <nav aria-label="Mobilní navigace" className="container-x flex flex-1 flex-col justify-center gap-1 py-8">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-(--line) py-4 text-[clamp(1.75rem,7vw,2.5rem)] font-semibold tracking-[-0.02em]"
            >
              <span className="font-mono text-[0.7rem] tracking-[0.16em] text-sand">0{i + 1}</span>
              {item.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <a href={SITE.phoneHref} className="text-lg text-ivory-100">
              {SITE.phone}
            </a>
            <a href={SITE.instagram} className="text-sand" target="_blank" rel="noopener noreferrer">
              Instagram {SITE.instagramHandle}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
