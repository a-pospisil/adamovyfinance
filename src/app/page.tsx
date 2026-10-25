import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { SkinInTheGame } from "@/components/home/SkinInTheGame";
import { Philosophy } from "@/components/home/Philosophy";
import { Figures } from "@/components/home/Figures";
import { Reviews } from "@/components/home/Reviews";
import { Workshop } from "@/components/home/Workshop";
import { Cases } from "@/components/home/Cases";
import { Contact } from "@/components/home/Contact";
import { SectionCarousel } from "@/components/home/SectionCarousel";
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
      <SectionCarousel
        slides={[
          { id: "cesta", label: "Cesta", content: <Story /> },
          { id: "investice", label: "Vlastní investice", content: <SkinInTheGame /> },
          { id: "jak-premyslim", label: "Jak přemýšlím", content: <Philosophy /> },
          { id: "zkusenost", label: "Zkušenost", content: <Figures /> },
          { id: "recenze", label: "Co říkají klienti", content: <Reviews /> },
          { id: "workshop", label: "Workshop", content: <Workshop now={now} /> },
          { id: "pripadova-studie", label: "Případová studie", content: <Cases /> },
          { id: "kontakt-sekce", label: "Kontakt", content: <Contact /> },
        ]}
      />
    </main>
  );
}
