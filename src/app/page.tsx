import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { SkinInTheGame } from "@/components/home/SkinInTheGame";
import { Philosophy } from "@/components/home/Philosophy";
import { Figures } from "@/components/home/Figures";
import { Reviews } from "@/components/home/Reviews";
import { Workshop } from "@/components/home/Workshop";
import { Cases } from "@/components/home/Cases";
import { Contact } from "@/components/home/Contact";
import { JsonLd } from "@/components/ui/JsonLd";
import { profilePageSchema } from "@/lib/schema";

/** Ceny workshopů závisí na datu — přegenerovat nejvýš jednou za hodinu. */
export const revalidate = 3600;

export default function Home() {
  const now = new Date();
  return (
    <main>
      <JsonLd data={profilePageSchema()} />
      <Hero />
      <Story />
      <SkinInTheGame />
      <Philosophy />
      <Figures />
      <Reviews />
      <Workshop now={now} />
      <Cases />
      <Contact />
    </main>
  );
}
