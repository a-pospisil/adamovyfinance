import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { ChaosSystem } from "@/components/home/ChaosSystem";
import { MortgageChain } from "@/components/home/MortgageChain";
import { InvestmentProperty } from "@/components/home/InvestmentProperty";
import { PortfolioBuilder } from "@/components/home/PortfolioBuilder";
import { SkinInTheGame } from "@/components/home/SkinInTheGame";
import { DataWall } from "@/components/home/DataWall";
import { BankSaidNo } from "@/components/home/BankSaidNo";
import { Banks } from "@/components/home/Banks";
import { WorkshopTeaser } from "@/components/home/WorkshopTeaser";
import { CaseStudies } from "@/components/home/CaseStudies";
import { Notes } from "@/components/home/Notes";
import { ContactCta } from "@/components/home/ContactCta";

/** Workshop pricing depends on the date; re-render at most once an hour. */
export const revalidate = 3600;

export default function Home() {
  const now = new Date();
  return (
    <main>
      <Hero />
      <Story />
      <ChaosSystem />
      <MortgageChain />
      <InvestmentProperty />
      <PortfolioBuilder />
      <SkinInTheGame />
      <DataWall />
      <BankSaidNo />
      <Banks />
      <WorkshopTeaser now={now} />
      <CaseStudies />
      <Notes />
      <ContactCta />
    </main>
  );
}
