"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "ai" | "user";
  content: string;
}

const AI_RESPONSES = [
  `Com base nos dados do StatsBomb (última temporada) e na forma atual via FBref, o <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">Arsenal</span> acumulou <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">xG 2.14/jogo</span> em casa — top 3 da Premier League. O Chelsea tem <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">xGC 1.2/jogo</span> fora, o que reforça o favoritismo dos Gunners. Probabilidade calculada: <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">67% Arsenal</span>.`,
  `Analisando o padrão histórico: em clássicos contra o Arsenal nos últimos 5 H2H, o Chelsea marcou primeiro em apenas 1 jogo. O padrão ofensivo atual do Chelsea fora de casa é <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">0.8 xG/jogo</span> — abaixo da média. Arsenal em casa tem <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">71% de aproveitamento</span>.`,
  `Saka está em <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">forma excepcional</span>: 2.3x acima da média em duelos ganhos, 6 assistências nas últimas 8 rodadas (FBref 2025-26). Quando atinge esse nível de atividade, contribui decisivamente em <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">41% dos jogos restantes</span>.`,
  `O árbitro Michael Oliver tem média de <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">4.2 cartões/jogo</span> e <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">0.3 pênaltis/jogo</span> na temporada — levemente acima da média da PL. Em clássicos do Top 6, a tendência de cartão sobe 18%. Apostar em cartão tem <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[3px]">mercado favorável hoje</span>.`,
];

const SUGGESTIONS = [
  "Por que o Arsenal é favorito?",
  "Padrão de gol do Chelsea",
  "Melhor xG da rodada",
  "Performance do Saka",
  "Árbitro de hoje",
];

const INITIAL_MESSAGE: Message = {
  role: "ai",
  content:
    "Olá! Sou o Tipster IA da GOAT TIPS. Tenho acesso a dados ao vivo da BetsAPI, histórico de partidas do StatsBomb e estatísticas individuais do FBref 2025-26. O que você quer analisar hoje?",
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text?: string) {
    const msg = text ?? input.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = AI_RESPONSES[responseIdx % AI_RESPONSES.length];
      setResponseIdx((i) => i + 1);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    }, 1400);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug}
            onClick={() => sendMessage(sug)}
            className="bg-(--pill-bg) border border-(--pill-border) rounded-[30px] px-4 py-2 text-[13px] text-(--text2) cursor-pointer font-medium hover:bg-(--blue-dim) hover:border-(--blue-mid) hover:text-[#012AFE] transition-all duration-200"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {sug}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-[14px] overflow-hidden min-h-[380px] flex flex-col">
        <div className="flex-1 p-6 flex flex-col gap-4 max-h-[400px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                  msg.role === "ai"
                    ? "bg-[#012AFE] text-white text-[11px] tracking-[0.05em]"
                    : "bg-(--bg3) text-(--text2) text-[12px]"
                }`}
                style={msg.role === "ai" ? { fontFamily: "var(--font-display)" } : {}}
              >
                {msg.role === "ai" ? "GT" : "EU"}
              </div>
              <div
                className={`rounded-[14px] px-4 py-3 text-[14px] leading-[1.55] max-w-[72%] border ${
                  msg.role === "user"
                    ? "bg-[#012AFE] text-white border-transparent rounded-[14px_14px_4px_14px]"
                    : "bg-(--bg2) text-(--text) border-border rounded-[14px_14px_14px_4px]"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-start">
              <div
                className="w-8 h-8 rounded-full bg-[#012AFE] text-white text-[11px] tracking-[0.05em] flex items-center justify-center font-bold shrink-0"
                style={{ fontFamily: "var(--font-display)" }}
              >
                GT
              </div>
              <div className="bg-(--bg2) border border-border rounded-[14px_14px_14px_4px] px-4 py-3">
                <div className="flex gap-1 items-center py-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--text3)] animate-bounce-dot"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-4 border-t border-border flex gap-[10px] items-center bg-(--surface)">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ex: por que o Arsenal vai ganhar hoje?"
            className="flex-1 bg-(--bg3) border border-border rounded-lg px-4 py-[11px] text-[14px] text-(--text) outline-none focus:border-(--blue-mid) transition-colors duration-200 placeholder:text-(--text3)"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button
            onClick={() => sendMessage()}
            className="w-10 h-10 bg-[#012AFE] border-none rounded-lg text-white flex items-center justify-center shrink-0 cursor-pointer hover:opacity-[0.85] transition-opacity duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8L3 3l2 5-2 5 10-5z" fill="white" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
