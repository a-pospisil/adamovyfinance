import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <main>
      <Section theme="dark" className="flex min-h-[80svh] items-center pt-32">
        <div>
          <p className="eyebrow">404</p>
          <h1 className="display display-lg mt-6">
            Tahle stránka <span className="serif-accent text-moss-300">neexistuje.</span>
          </h1>
          <p className="lead mt-8 max-w-md text-sand">Ale vaše portfolio ano. Zkuste jednu z těchto cest.</p>
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
