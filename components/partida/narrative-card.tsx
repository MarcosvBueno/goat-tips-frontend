"use client";

import { useNarrative } from "@/hooks/use-predictions";
import type { NarrativeResponse } from "@/types/api";

interface NarrativeCardProps {
  eventId: string;
}

const CONFIDENCE_STYLES: Record<string, { bg: string; color: string }> = {
  Alta: { bg: "rgba(0,200,150,0.12)", color: "#00C896" },
  Média: { bg: "rgba(255,184,0,0.12)", color: "#FFB800" },
  Baixa: { bg: "rgba(255,59,59,0.12)", color: "#FF3B3B" },
};

function NarrativeContent({ data }: { data: NarrativeResponse }) {
  const style = CONFIDENCE_STYLES[data.confidence_label] ?? CONFIDENCE_STYLES["Média"];

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border mt-4">
      {data.headline && (
        <div className="px-5 py-3.5 border-b border-border bg-(--surface)">
          <div className="flex items-start gap-2">
            <span className="text-[#012AFE] text-[16px] mt-px shrink-0">&#9889;</span>
            <p className="text-[14px] font-semibold text-(--text) leading-snug">
              {data.headline}
            </p>
          </div>
        </div>
      )}

      {data.analysis && (
        <div className="px-5 py-3 text-[13px] text-(--text2) leading-relaxed border-b border-border">
          {data.analysis}
        </div>
      )}

      {data.prediction && (
        <div className="px-5 py-3 border-b border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-(--text3)">
            Previsão
          </span>
          <p className="text-[13px] text-(--text) leading-relaxed mt-1">{data.prediction}</p>
        </div>
      )}

      {data.momentum_signal && (
        <div className="px-5 py-2.5 bg-[rgba(1,42,254,0.04)] border-b border-border">
          <p className="text-[12px] text-(--text2) leading-normal italic">
            &#128202; {data.momentum_signal}
          </p>
        </div>
      )}

      <div className="px-5 py-2.5 flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-full"
          style={{ background: style.bg, color: style.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.color }} />
          Confiança {data.confidence_label}
        </span>
        {data.data_sources && data.data_sources.length > 0 && (
          <div className="flex gap-1">
            {data.data_sources.map((src) => (
              <span key={src} className="text-[9px] bg-(--bg3) text-(--text3) px-1.5 py-0.5 rounded font-mono uppercase tracking-wide">
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function NarrativeCard({ eventId }: NarrativeCardProps) {
  const { data, isLoading, isFetched, refetch } = useNarrative(eventId);

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
      <div className="flex items-center justify-between font-mono mb-2">
        <div
          className="text-[14px] uppercase tracking-[0.04em] text-muted-foreground font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Resumo Inteligente
        </div>
        {!isFetched && (
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-[12px] font-semibold text-white bg-primary px-4 py-1.5 rounded-lg cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Gerando..." : "Gerar Narrativa"}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-4 flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 bg-(--bg3) rounded animate-pulse" style={{ width: `${90 - i * 20}%` }} />
          ))}
        </div>
      )}

      {data && <NarrativeContent data={data} />}

      {!isLoading && !data && isFetched && (
        <div className="mt-4 text-[13px] text-(--text3) text-center py-4">
          Não foi possível gerar a narrativa. Tente novamente.
        </div>
      )}
    </div>
  );
}
