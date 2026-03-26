"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAskQuestion } from "@/hooks/use-predictions";
import { useChatStore } from "@/store/use-chat-store";
import type { ChatMessage, NarrativeResponse } from "@/types/api";

const SUGGESTIONS = [
  "Arsenal vai ganhar?",
  "Melhor xG da rodada",
  "Performance do Saka",
  "Árbitro de hoje",
];

function FloatingNarrativeBubble({ msg }: { msg: ChatMessage }) {
  const { narrative } = msg;
  if (!narrative) return null;

  const confidenceColor =
    narrative.confidence_label === "Alta"
      ? "#00C896"
      : narrative.confidence_label === "Baixa"
        ? "#FF3B3B"
        : "#FFB800";

  return (
    <div className="flex-1 min-w-0 overflow-hidden text-[12px] leading-relaxed bg-(--bg2) border border-border rounded-[14px] rounded-bl-[4px]">
      {narrative.headline && (
        <div className="px-3 py-2.5 flex items-start gap-1.5 border-b border-border">
          <span className="text-[#012AFE]">⚡</span>
          <span className="font-semibold text-[12px] text-(--text)">
            {narrative.headline}
          </span>
        </div>
      )}

      {narrative.analysis && (
        <div className="px-3 py-2 text-[12px] text-(--text2) border-b border-border">
          {narrative.analysis}
        </div>
      )}

      {narrative.prediction && (
        <div className="px-3 py-2 text-[12px] text-(--text) border-b border-border">
          <span className="font-bold text-[10px] uppercase tracking-wider text-(--text2)">
            Previsão:{" "}
          </span>
          {narrative.prediction}
        </div>
      )}

      {narrative.momentum_signal && (
        <div className="px-3 py-2 text-[11px] italic text-(--text2) border-b border-border">
          📊 {narrative.momentum_signal}
        </div>
      )}

      {narrative.confidence_label && (
        <div className="px-3 py-2 flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: confidenceColor }}
          />
          <span className="text-[10px] font-bold" style={{ color: confidenceColor }}>
            Confiança {narrative.confidence_label}
          </span>
          {msg.partial_context && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[rgba(255,184,0,0.15)] text-[#FFB800]">
              Dados parciais
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function FloatingBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { getOrCreateSession, addMessage, setTyping } = useChatStore();
  const session = useChatStore((s) => s.sessions["__global__"] ?? null);
  const askMutation = useAskQuestion();

  const currentSession = session ?? getOrCreateSession();
  const messages = currentSession.messages;
  const isTyping = currentSession.isTyping;
  const sessionId = currentSession.sessionId;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function makeAiMsg(response: NarrativeResponse): ChatMessage {
    return {
      id: crypto.randomUUID(),
      role: "ai",
      content: response.analysis || response.headline || "",
      narrative: response,
      confidence_label: response.confidence_label,
      partial_context: response.partial_context,
      timestamp: Date.now(),
    };
  }

  function sendMessage(text?: string) {
    const msg = text ?? input.trim();
    if (!msg || isTyping) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: msg,
      timestamp: Date.now(),
    };

    addMessage(userMsg);
    setInput("");
    setTyping(true);

    askMutation.mutate(
      { question: msg, sessionId },
      {
        onSuccess: (response) => {
          addMessage(makeAiMsg(response));
          setTyping(false);
        },
        onError: () => {
          const errorMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "ai",
            content: "Erro ao processar. Tente novamente.",
            timestamp: Date.now(),
          };
          addMessage(errorMsg);
          setTyping(false);
        },
      },
    );
  }

  if (pathname === "/tipster") return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay mobile */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Painel do chat */}
            <motion.div
              className="fixed z-50 flex flex-col overflow-hidden bg-card border border-border rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.18),0_0_0_1px_rgba(1,42,254,0.12)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(1,42,254,0.15)]"
              style={{
                bottom: "88px",
                right: "20px",
                width: "min(380px, calc(100vw - 24px))",
                height: "min(540px, calc(100dvh - 110px))",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 shrink-0 border-b border-border bg-linear-to-br from-[rgba(1,42,254,0.08)] to-transparent">
                <div className="w-9 h-9 rounded-full bg-[#012AFE] flex items-center justify-center shrink-0">
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
                    className="text-[14px] font-semibold leading-tight text-(--text)"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Tipster IA
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D68F]" />
                    <span className="text-[11px] text-(--text2)">
                      Online · Análise em tempo real
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0 cursor-pointer text-(--text2) hover:text-(--text)"
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

              {/* Sugestões */}
              <div
                className="flex gap-2 px-4 py-3 overflow-x-auto shrink-0 border-b border-border"
                style={{ scrollbarWidth: "none" }}
              >
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => sendMessage(sug)}
                    disabled={isTyping}
                    className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap disabled:opacity-50 bg-(--pill-bg) border border-(--pill-border) text-(--text2) hover:text-[#012AFE] hover:border-(--blue-mid) hover:bg-(--blue-dim)"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Mensagens */}
              <div
                className="flex-1 flex flex-col gap-3 px-4 py-4 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {messages.length === 0 && (
                  <div className="text-[13px] text-center py-4 text-(--text2)">
                    Pergunte sobre qualquer partida da Premier League
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-[#012AFE] flex items-center justify-center shrink-0 mt-0.5">
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
                    {msg.role === "user" ? (
                      <div
                        className="px-3 py-2.5 text-[13px] leading-[1.55] max-w-[82%] bg-[#012AFE] text-white rounded-[14px] rounded-tr-[4px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {msg.content}
                      </div>
                    ) : msg.narrative ? (
                      <FloatingNarrativeBubble msg={msg} />
                    ) : (
                      <div
                        className="px-3 py-2.5 text-[13px] leading-[1.55] max-w-[82%] bg-(--bg2) text-(--text) border border-border rounded-[14px] rounded-bl-[4px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {msg.content}
                      </div>
                    )}
                  </div>
                ))}

                {/* Digitando */}
                {isTyping && (
                  <div className="flex gap-2.5 items-end">
                    <div className="w-7 h-7 rounded-full bg-[#012AFE] flex items-center justify-center shrink-0">
                      <div className="relative w-4 h-4">
                        <Image
                          src="/goat-tips-logo.svg"
                          alt=""
                          fill
                          className="object-contain brightness-0 invert"
                        />
                      </div>
                    </div>
                    <div className="px-3 py-3 bg-(--bg2) border border-border rounded-[14px] rounded-bl-[4px]">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-(--text3) animate-bounce-dot"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 flex gap-2 items-center shrink-0 border-t border-border">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Pergunte sobre uma partida..."
                  disabled={isTyping}
                  className="flex-1 px-3 py-2.5 rounded-xl text-[13px] outline-none transition-colors duration-200 disabled:opacity-50 bg-(--pill-bg) border border-(--pill-border) text-(--text) focus:border-(--blue-mid) placeholder:text-(--text3)"
                  style={{ fontFamily: "var(--font-body)" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isTyping || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-[#012AFE] text-white flex items-center justify-center shrink-0 cursor-pointer hover:opacity-85 transition-opacity duration-150 disabled:opacity-50"
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

      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-5 z-50 md:bottom-8 md:right-8">
        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-visible cursor-pointer bg-[#012AFE]"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          aria-label="Abrir Tipster IA"
          style={{
            background: "linear-gradient(135deg, #0038FF 0%, #012AFE 60%, #001ED4 100%)",
            boxShadow: isOpen
              ? "0 0 0 3px rgba(1,42,254,0.4), 0 12px 40px rgba(1,42,254,0.55)"
              : "0 0 0 2px rgba(1,42,254,0.2), 0 8px 24px rgba(1,42,254,0.4)",
          }}
        >
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
                transition={{ duration: 2.2, delay: 0.9, repeat: Infinity, ease: "easeOut" }}
              />
            </>
          )}

          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)",
            }}
          />

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

          {!isOpen && (
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-card flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#00D68F] animate-pulse-red block" />
            </div>
          )}
        </motion.button>
      </div>
    </>
  );
}
