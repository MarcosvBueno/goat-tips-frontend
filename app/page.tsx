import { Hero } from "@/components/home/hero";
import { TickerBand } from "@/components/home/ticker-band";
import { CtaBanner } from "@/components/home/cta-banner";
import { HomeMatches } from "@/components/home/home-matches";

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <TickerBand />
      <CtaBanner />
      <HomeMatches />
    </div>
  );
}
