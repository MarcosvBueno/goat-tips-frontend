import type { ChatMessage } from "@/types/api";

interface AiMessageBubbleProps {
  msg: ChatMessage;
  compact?: boolean;
}

const CONFIDENCE_STYLES = {
  Alta: { bg: "rgba(0,200,150,0.12)", color: "#00C896", dot: "bg-[#00C896]" },
  Média: { bg: "rgba(255,184,0,0.12)", color: "#FFB800", dot: "bg-[#FFB800]" },
  Baixa: { bg: "rgba(255,59,59,0.12)", color: "#FF3B3B", dot: "bg-[#FF3B3B]" },
};

const EMOJI_REGEX = /[\p{Extended_Pictographic}\uFE0F]/gu;

function cleanModelText(text?: string) {
  if (!text) return "";
  return text.replace(EMOJI_REGEX, "").replace(/\s{2,}/g, " ").trim();
}

function ConfidenceBadge({ label }: { label: string }) {
  const style = CONFIDENCE_STYLES[label as keyof typeof CONFIDENCE_STYLES] ?? CONFIDENCE_STYLES["Média"];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-full"
      style={{ background: style.bg, color: style.color }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      Confiança {label}
    </span>
  );
}

function DataSourceBadges({ sources }: { sources: string[] }) {
  const labels: Record<string, string> = {
    live_context: "Ao vivo",
    historical_stats: "Histórico",
    player_intel: "Jogadores",
    quant: "Modelo",
  };
  return (
    <div className="flex gap-1 flex-wrap">
      {sources.map((src) => (
        <span
          key={src}
          className="text-[9px] bg-(--bg3) text-(--text3) px-1.5 py-0.5 rounded font-mono uppercase tracking-wide"
        >
          {labels[src] ?? src}
        </span>
      ))}
    </div>
  );
}

export function AiMessageBubble({ msg, compact = false }: AiMessageBubbleProps) {
  const { narrative } = msg;
  const cleanHeadline = cleanModelText(narrative?.headline);
  const cleanAnalysis = cleanModelText(narrative?.analysis);
  const cleanPrediction = cleanModelText(narrative?.prediction);
  const cleanMomentum = cleanModelText(narrative?.momentum_signal);
  const cleanContent = cleanModelText(msg.content);

  // Mensagem simples (boas-vindas, erros, sem narrative estruturada)
  if (!narrative || (!cleanHeadline && !cleanPrediction && !cleanMomentum)) {
    return (
      <div className="relative overflow-hidden rounded-[16px] rounded-bl-[5px] border border-black/10 bg-[linear-gradient(180deg,rgba(1,42,254,0.06)_0%,rgba(1,42,254,0.02)_100%)] px-4 py-3 text-[14px] leading-[1.65] text-(--text) shadow-[0_10px_30px_rgba(1,42,254,0.06)] backdrop-blur-sm dark:border-white/24">
        {cleanContent}
        {msg.partial_context && (
          <span className="ml-2 inline-flex items-center rounded-full bg-[rgba(255,184,0,0.1)] px-2 py-0.5 text-[10px] font-semibold text-[#FFB800]">
            Dados parciais
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[16px] rounded-bl-[5px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.48)_100%)] shadow-[0_10px_40px_rgba(1,42,254,0.08)] backdrop-blur-md dark:border-white/24 dark:bg-[linear-gradient(180deg,rgba(14,16,28,0.84)_0%,rgba(10,12,22,0.58)_100%)]">

      {/* Headline */}
      {cleanHeadline && (
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-start gap-2.5">
            <span className="mt-[2px] h-2 w-2 shrink-0 rounded-full bg-[#012AFE]" aria-hidden="true" />
            <p
              className="text-[14px] font-semibold tracking-[0.01em] text-(--text) leading-snug"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {cleanHeadline}
            </p>
          </div>
        </div>
      )}

      {/* Analysis body */}
      {cleanAnalysis && (
        <div className="px-4 py-3 border-b border-border text-[13px] leading-[1.72] text-(--text2)">
          {cleanAnalysis}
        </div>
      )}

      {/* Prediction block */}
      {cleanPrediction && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-start gap-2.5">
            <span className="mt-[5px] h-[1px] w-3 shrink-0 bg-[#012AFE]/55" aria-hidden="true" />
            <span className="text-[11px] mt-[1px] shrink-0 font-semibold uppercase tracking-[0.16em] text-(--text3)">
              Previsão
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-[1.65] text-(--text)">
            {cleanPrediction}
          </p>
        </div>
      )}

      {/* Momentum signal */}
      {cleanMomentum && (
        <div className="border-b border-border bg-[linear-gradient(90deg,rgba(1,42,254,0.08)_0%,rgba(1,42,254,0.03)_65%,transparent_100%)] px-4 py-2.5 dark:bg-[linear-gradient(90deg,rgba(1,42,254,0.2)_0%,rgba(1,42,254,0.06)_65%,transparent_100%)]">
          <div className="flex items-start gap-2.5">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#012AFE]/80" aria-hidden="true" />
            <p className="text-[12px] italic leading-normal text-(--text2)">
              {cleanMomentum}
            </p>
          </div>
        </div>
      )}

      {/* Footer: confidence + sources */}
      {!compact && (
        <div className="px-4 py-2.5 flex items-center flex-wrap gap-2">
          {narrative.confidence_label && (
            <ConfidenceBadge label={narrative.confidence_label} />
          )}
          {msg.partial_context && (
            <span className="text-[10px] text-[#FFB800] bg-[rgba(255,184,0,0.1)] px-2 py-[3px] rounded-full font-semibold">
              Dados parciais
            </span>
          )}
          {msg.data_sources && msg.data_sources.length > 0 && (
            <DataSourceBadges sources={msg.data_sources} />
          )}
        </div>
      )}
    </div>
  );
}
