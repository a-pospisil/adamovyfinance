import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Specialisation } from "@/components/home/Specialisation";
import { Figures } from "@/components/home/Figures";
import { Workshop } from "@/components/home/Workshop";
import { Contact } from "@/components/home/Contact";

/** Ceny workshopů závisí na datu — přegenerovat nejvýš jednou za hodinu. */
export const revalidate = 3600;

export default function Home() {
  const now = new Date();
  return (
    <main>
      <Hero />
      <About />
      <Specialisation />
      <Figures />
      <Workshop now={now} />
      <Contact />
    </main>
  );
}
