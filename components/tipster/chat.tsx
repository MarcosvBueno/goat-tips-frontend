"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAskQuestion } from "@/hooks/use-predictions";
import { useChatStore } from "@/store/use-chat-store";
import { AiMessageBubble } from "@/components/chat/ai-message-bubble";
import type { ChatMessage, NarrativeResponse } from "@/types/api";

function createMessage(
  role: "user" | "ai",
  content: string,
  extra?: Partial<ChatMessage>,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
    ...extra,
  };
}

function narrativeToMessage(response: NarrativeResponse): ChatMessage {
  return createMessage(
    "ai",
    response.analysis || response.headline || "",
    {
      narrative: response,
      confidence_label: response.confidence_label,
      partial_context: response.partial_context,
      data_sources: response.data_sources,
    },
  );
}

const SUGGESTIONS = [
  "Qual time tem melhor forma na Premier League?",
  "Quem é o artilheiro da temporada?",
  "Qual árbitro aplica mais cartões?",
  "Probabilidade do próximo jogo do Arsenal",
  "Análise do Liverpool vs Man City",
];

const INITIAL_CONTENT =
  "Olá! Sou o Goat AI da GOAT TIPS. Tenho acesso a dados ao vivo da BetsAPI, histórico de 4.585 jogos e previsões com modelo Poisson calibrado. O que você quer analisar hoje?";

export function Chat() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const { getOrCreateSession, addMessage, setTyping } = useChatStore();
  const session = useChatStore((s) => s.sessions["__global__"] ?? null);
  const askMutation = useAskQuestion();

  useEffect(() => {
    if (!initialized.current && !session) {
      initialized.current = true;
      getOrCreateSession();
      addMessage(createMessage("ai", INITIAL_CONTENT));
    }
  }, [session, getOrCreateSession, addMessage]);

  const messages = session?.messages ?? [];
  const isTyping = session?.isTyping ?? false;
  const sessionId = session?.sessionId ?? "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const handleSend = useCallback(
    (text?: string) => {
      const msg = text ?? input.trim();
      if (!msg || isTyping) return;

      addMessage(createMessage("user", msg));
      setInput("");
      setTyping(true);

      askMutation.mutate(
        { question: msg, sessionId },
        {
          onSuccess: (response) => {
            addMessage(narrativeToMessage(response));
            setTyping(false);
          },
          onError: () => {
            addMessage(createMessage("ai", "Desculpe, ocorreu um erro. Tente novamente."));
            setTyping(false);
          },
        },
      );
    },
    [input, isTyping, sessionId, addMessage, setTyping, askMutation],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Sugestões */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug}
            onClick={() => handleSend(sug)}
            disabled={isTyping}
            className="bg-(--pill-bg) border border-(--pill-border) rounded-[30px] px-4 py-2 text-[13px] text-(--text2) cursor-pointer font-medium hover:bg-(--blue-dim) hover:border-(--blue-mid) hover:text-[#012AFE] transition-all duration-200 disabled:opacity-50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Área do chat */}
      <div className="bg-card border border-border rounded-[14px] overflow-hidden min-h-[380px] flex flex-col">
        <div className="flex-1 p-6 flex flex-col gap-4 max-h-[560px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar IA */}
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-[#012AFE] flex items-center justify-center shrink-0 mt-0.5">
                  <div className="relative w-4 h-4">
                    <Image
                      src="/azul-simbolo.svg"
                      alt=""
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </div>
              )}

              {/* Avatar user */}
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-(--bg3) flex items-center justify-center text-[12px] font-bold text-(--text2) shrink-0">
                  EU
                </div>
              )}

              {/* Conteúdo */}
              <div className={`${msg.role === "user" ? "max-w-[72%]" : "flex-1 min-w-0"}`}>
                {msg.role === "user" ? (
                  <div className="bg-[#012AFE] text-white rounded-[14px] rounded-tr-[4px] px-4 py-3 text-[14px] leading-[1.55]">
                    {msg.content}
                  </div>
                ) : (
                  <AiMessageBubble msg={msg} />
                )}
              </div>
            </div>
          ))}

          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#012AFE] flex items-center justify-center shrink-0">
                <div className="relative w-4 h-4">
                  <Image src="/azul-simbolo.svg" alt="" fill className="object-contain brightness-0 invert" />
                </div>
              </div>
              <div className="bg-(--bg2) border border-border rounded-[14px] rounded-bl-[4px] px-4 py-3">
                <div className="flex gap-1 items-center py-1">
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
        <div className="px-4 py-4 border-t border-border flex gap-[10px] items-center bg-(--surface)">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ex: qual a probabilidade do Arsenal ganhar?"
            disabled={isTyping}
            className="flex-1 bg-(--bg3) border border-border rounded-lg px-4 py-[11px] text-[14px] text-(--text) outline-none focus:border-(--blue-mid) transition-colors duration-200 placeholder:text-(--text3) disabled:opacity-50"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="w-10 h-10 bg-[#012AFE] border-none rounded-lg text-white flex items-center justify-center shrink-0 cursor-pointer hover:opacity-[0.85] transition-opacity duration-200 disabled:opacity-50"
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
