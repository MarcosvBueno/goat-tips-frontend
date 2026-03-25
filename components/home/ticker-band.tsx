"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TICKER_ITEMS = [
  { type: "brand" as const },
  { type: "text" as const, content: "Análise com IA em tempo real" },
  { type: "dot" as const },
  { type: "text" as const, content: "Aposte com segurança e inteligência" },
  { type: "dot" as const },
  { type: "text" as const, content: "Dados do StatsBomb · FBref · BetsAPI" },
  { type: "brand" as const },
  { type: "text" as const, content: "84% de acurácia comprovada" },
  { type: "dot" as const },
  { type: "text" as const, content: "Probabilidades calibradas sem viés humano" },
  { type: "dot" as const },
  { type: "text" as const, content: "Tips que realmente convertem" },
  { type: "brand" as const },
  { type: "text" as const, content: "xG · PPDA · Over/Under com precisão" },
  { type: "dot" as const },
  { type: "text" as const, content: "1.8k+ partidas analisadas" },
  { type: "dot" as const },
  { type: "text" as const, content: "Jogue com responsabilidade" },
];

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2 mx-8 shrink-0">
      <span className="relative w-5 h-5 shrink-0">
        <Image
          src="/goat-tips-logo.svg"
          alt="Goat Tips"
          fill
          className="object-contain brightness-0 invert opacity-90"
        />
      </span>
      <span
        className="text-[15px] uppercase tracking-[0.06em] text-white/90 leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        GOAT TIPS
      </span>
    </span>
  );
}

function TickerItem({ item }: { item: (typeof TICKER_ITEMS)[number] }) {
  if (item.type === "brand") return <BrandMark />;

  if (item.type === "dot") {
    return (
      <span className="inline-block w-[4px] h-[4px] rounded-full bg-white/40 mx-4 shrink-0 self-center" />
    );
  }

  return (
    <span
      className="text-[13px] font-medium text-white/80 whitespace-nowrap tracking-[0.03em] shrink-0"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {item.content}
    </span>
  );
}

export function TickerBand() {
  const duplicated = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="relative overflow-hidden py-[11px]"
      style={{ background: "#012AFE", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
    >
      {/* Gradient fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #012AFE 20%, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #012AFE 20%, transparent)" }}
      />

      <motion.div
        className="flex items-center"
        animate={{ x: [0, "-33.333%"] }}
        transition={{
          duration: 32,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{ width: "max-content" }}
      >
        {duplicated.map((item, i) => (
          <TickerItem key={i} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
