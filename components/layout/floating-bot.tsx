"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ── Chat logic ────────────────────────────────────────────────────────────────

interface Message {
  role: "ai" | "user";
  content: string;
}

const AI_RESPONSES = [
  `Com base nos dados do StatsBomb e na forma atual via FBref, o <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[2px]">Arsenal</span> acumulou <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[2px]">xG 2.14/jogo</span> em casa. Probabilidade calculada: <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[2px]">67% Arsenal</span>.`,
  `Analisando H2H dos últimos 5 jogos: Chelsea marcou primeiro em apenas 1. Arsenal em casa tem <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[2px]">71% de aproveitamento</span>.`,
  `Saka em <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[2px]">forma excepcional</span>: 6 assistências nas últimas 8 rodadas. Contribui decisivamente em <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[2px]">41% dos jogos</span>.`,
  `O árbitro tem média de <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[2px]">4.2 cartões/jogo</span>. Em clássicos do Top 6 a tendência sobe 18%. Mercado de cartão <span class="inline-block bg-[rgba(1,42,254,0.12)] text-[#012AFE] text-[11px] font-semibold px-2 py-[2px] rounded-[4px] mx-[2px]">favorável hoje</span>.`,
];

const SUGGESTIONS = [
  "Arsenal vai ganhar?",
  "Melhor xG da rodada",
  "Performance do Saka",
  "Árbitro de hoje",
];

const INITIAL: Message = {
  role: "ai",
  content:
    "Olá! Sou o Tipster IA da GOAT TIPS. Tenho acesso a dados ao vivo, histórico do StatsBomb e estatísticas do FBref 2025-26. O que quer analisar?",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function FloatingBot() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track theme
  useEffect(() => {
    const html = document.documentElement;
    const current = html.classList.contains("dark");
    if (current !== isDark) setIsDark(current);
    const observer = new MutationObserver(() =>
      setIsDark(html.classList.contains("dark")),
    );
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  if (pathname === "/tipster") return null;

  const panelBg = isDark ? "#0D1117" : "#ffffff";
  const panelBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "#f0f0f0" : "#0A0F2E";
  const text2 = isDark ? "rgba(240,240,240,0.45)" : "rgba(10,15,46,0.45)";
  const msgBubbleBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const msgBubbleBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const suggBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const suggBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (mobile only) */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed z-50 flex flex-col overflow-hidden"
              style={{
                bottom: "88px",
                right: "20px",
                width: "min(380px, calc(100vw - 24px))",
                height: "min(540px, calc(100dvh - 110px))",
                background: panelBg,
                border: `1px solid ${panelBorder}`,
                borderRadius: "20px",
                boxShadow: isDark
                  ? "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(1,42,254,0.15)"
                  : "0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(1,42,254,0.12)",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-4 py-3 shrink-0"
                style={{
                  borderBottom: `1px solid ${panelBorder}`,
                  background: isDark
                    ? "linear-gradient(135deg, rgba(1,42,254,0.12) 0%, rgba(1,42,254,0.04) 100%)"
                    : "linear-gradient(135deg, rgba(1,42,254,0.07) 0%, rgba(1,42,254,0.02) 100%)",
                }}
              >
                {/* Logo avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#012AFE" }}
                >
                  <div className="relative w-5 h-5">
                    <Image
                      src="/goat-tips-logo.svg"
                      alt="Goat Tips IA"
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-[14px] font-semibold leading-tight"
                    style={{ color: textColor, fontFamily: "var(--font-body)" }}
                  >
                    Tipster IA
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D68F] animate-pulse-red" />
                    <span className="text-[11px]" style={{ color: text2 }}>
                      Online · Análise em tempo real
                    </span>
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0"
                  style={{ color: text2 }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                  }
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 1l12 12M13 1L1 13"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Suggestions */}
              <div
                className="flex gap-2 px-4 py-3 overflow-x-auto shrink-0"
                style={{
                  borderBottom: `1px solid ${panelBorder}`,
                  scrollbarWidth: "none",
                }}
              >
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => sendMessage(sug)}
                    className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap"
                    style={{
                      background: suggBg,
                      border: `1px solid ${suggBorder}`,
                      color: text2,
                      fontFamily: "var(--font-body)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(1,42,254,0.12)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(1,42,254,0.3)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#012AFE";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = suggBg;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = suggBorder;
                      (e.currentTarget as HTMLButtonElement).style.color = text2;
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div
                className="flex-1 flex flex-col gap-3 px-4 py-4 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "ai" && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                        style={{ background: "#012AFE" }}
                      >
                        <div className="relative w-4 h-4">
                          <Image
                            src="/goat-tips-logo.svg"
                            alt=""
                            fill
                            className="object-contain brightness-0 invert"
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className="px-3 py-2.5 text-[13px] leading-[1.55] max-w-[82%]"
                      style={{
                        background:
                          msg.role === "user" ? "#012AFE" : msgBubbleBg,
                        color: msg.role === "user" ? "#ffffff" : textColor,
                        border:
                          msg.role === "user"
                            ? "none"
                            : `1px solid ${msgBubbleBorder}`,
                        borderRadius:
                          msg.role === "user"
                            ? "14px 14px 4px 14px"
                            : "14px 14px 14px 4px",
                        fontFamily: "var(--font-body)",
                      }}
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2.5 items-end">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#012AFE" }}
                    >
                      <div className="relative w-4 h-4">
                        <Image
                          src="/goat-tips-logo.svg"
                          alt=""
                          fill
                          className="object-contain brightness-0 invert"
                        />
                      </div>
                    </div>
                    <div
                      className="px-3 py-3"
                      style={{
                        background: msgBubbleBg,
                        border: `1px solid ${msgBubbleBorder}`,
                        borderRadius: "14px 14px 14px 4px",
                      }}
                    >
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full animate-bounce-dot"
                            style={{
                              background: text2,
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                className="px-3 py-3 flex gap-2 items-center shrink-0"
                style={{ borderTop: `1px solid ${panelBorder}` }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Pergunte sobre uma partida..."
                  className="flex-1 px-3 py-2.5 rounded-xl text-[13px] outline-none transition-colors duration-200"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                    color: textColor,
                    fontFamily: "var(--font-body)",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      "rgba(1,42,254,0.4)")
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderColor =
                      inputBorder)
                  }
                />
                <button
                  onClick={() => sendMessage()}
                  className="w-9 h-9 rounded-xl bg-[#012AFE] text-white flex items-center justify-center shrink-0 cursor-pointer hover:opacity-85 transition-opacity duration-150"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M13 8L3 3l2 5-2 5 10-5z" fill="white" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating button ── */}
      <div className="fixed bottom-6 right-5 z-50 md:bottom-8 md:right-8">
        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-visible cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          aria-label="Abrir Tipster IA"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #0038FF 0%, #012AFE 60%, #001ED4 100%)"
              : "#012AFE",
            boxShadow: isOpen
              ? "0 0 0 3px rgba(1,42,254,0.4), 0 12px 40px rgba(1,42,254,0.55)"
              : isDark
              ? "0 0 0 2px rgba(1,42,254,0.2), 0 8px 24px rgba(1,42,254,0.4)"
              : "0 0 0 2px rgba(1,42,254,0.25), 0 8px 24px rgba(1,42,254,0.3)",
          }}
        >
          {/* Pulse rings — only when closed */}
          {!isOpen && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-[#012AFE]"
                animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#012AFE]"
                animate={{ scale: [1, 1.35], opacity: [0.2, 0] }}
                transition={{
                  duration: 2.2,
                  delay: 0.9,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </>
          )}

          {/* Inner highlight */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)",
            }}
          />

          {/* Icon: toggle between logo and X */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg
                key="close"
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="relative z-10"
              >
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.svg>
            ) : (
              <motion.div
                key="logo"
                className="relative w-8 h-8 z-10"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                <Image
                  src="/goat-tips-logo.svg"
                  alt="Goat Tips IA"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live badge */}
          {!isOpen && (
            <div
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                background: isDark ? "#0D1117" : "#ffffff",
                boxShadow: isDark
                  ? "0 0 0 1.5px rgba(255,255,255,0.1)"
                  : "0 0 0 1.5px rgba(0,0,0,0.06)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#00D68F] animate-pulse-red block" />
            </div>
          )}
        </motion.button>
      </div>
    </>
  );
}
