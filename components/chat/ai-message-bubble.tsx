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

  // Mensagem simples (boas-vindas, erros, sem narrative estruturada)
  if (!narrative || (!narrative.headline && !narrative.prediction && !narrative.momentum_signal)) {
    return (
      <div className="bg-(--bg2) text-(--text) border border-border rounded-[14px] rounded-bl-[4px] px-4 py-3 text-[14px] leading-[1.6]">
        {msg.content}
        {msg.partial_context && (
          <span className="ml-2 text-[10px] text-[#FFB800] bg-[rgba(255,184,0,0.1)] px-1.5 py-0.5 rounded font-semibold">
            Dados parciais
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-(--bg2) border border-border rounded-[14px] rounded-bl-[4px] overflow-hidden">
      {/* Headline */}
      {narrative.headline && (
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-start gap-2">
            <span className="text-[#012AFE] text-[16px] mt-px shrink-0">⚡</span>
            <p
              className="text-[14px] font-semibold text-(--text) leading-snug"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {narrative.headline}
            </p>
          </div>
        </div>
      )}

      {/* Analysis body */}
      {narrative.analysis && (
        <div className="px-4 py-3 text-[13px] text-(--text2) leading-[1.65] border-b border-border">
          {narrative.analysis}
        </div>
      )}

      {/* Prediction block */}
      {narrative.prediction && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-start gap-2">
            <span className="text-[12px] text-(--text3) mt-[2px] shrink-0 font-bold uppercase tracking-wider">
              Previsão
            </span>
          </div>
          <p className="text-[13px] text-(--text) leading-[1.6] mt-1">
            {narrative.prediction}
          </p>
        </div>
      )}

      {/* Momentum signal */}
      {narrative.momentum_signal && (
        <div className="px-4 py-2.5 bg-[rgba(1,42,254,0.04)] border-b border-border">
          <div className="flex items-start gap-2">
            <span className="text-[13px] shrink-0">📊</span>
            <p className="text-[12px] text-(--text2) leading-normal italic">
              {narrative.momentum_signal}
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
