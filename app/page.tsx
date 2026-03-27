import { Hero } from "@/components/home/hero";
import { TickerBand } from "@/components/home/ticker-band";
import { CtaBanner } from "@/components/home/cta-banner";
import { HomeMatches } from "@/components/home/home-matches";
import { TopPicks } from "@/components/home/top-picks";
import { FirstVisitPreloader } from "@/components/home/first-visit-preloader";
import { TelegramCta } from "@/components/home/telegram-cta";

export default function HomePage() {
  return (
    <FirstVisitPreloader>
      <div className="animate-fade-in">
        <Hero />
        <TickerBand />
        <CtaBanner />
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 space-y-12 pb-12">
          <TopPicks />
          <HomeMatches />
          <TelegramCta />
        </div>
      </div>
    </FirstVisitPreloader>
  );
}
