import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Numeral } from "@/components/engraving/Engraving";

export default function NotFound() {
  return (
    <main>
      <Section theme="paper" className="relative flex min-h-[80svh] items-center overflow-hidden pt-28">
        <Numeral
          value="404"
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-[18rem] leading-none sm:text-[26rem]"
          tone="brown"
          opacity={0.06}
        />
        <div className="relative">
          <p className="label-xs">Chyba 404</p>
          <h1 className="display display-lg mt-6 max-w-[14ch]">
            Tahle stránka <span className="italic-accent text-burgundy">neexistuje.</span>
          </h1>
          <p className="lead mt-7 max-w-md">Vaše portfolio ale ano. Zkuste jednu z těchto cest.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/">Úvod</Button>
            <Button href="/financovani" variant="outline">Financování</Button>
            <Button href="/workshopy" variant="outline">Workshopy</Button>
            <Button href="/kontakt" variant="outline">Kontakt</Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
