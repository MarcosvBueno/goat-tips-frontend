"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAskQuestion, useDeleteHistory } from "@/hooks/use-predictions";
import { useChatStore } from "@/store/use-chat-store";
import { AiMessageBubble } from "@/components/chat/ai-message-bubble";
import type { ChatMessage, NarrativeResponse } from "@/types/api";

function makeUserMsg(content: string): ChatMessage {
  return { id: crypto.randomUUID(), role: "user", content, timestamp: Date.now() };
}

function makeAiMsg(response: NarrativeResponse): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "ai",
    content: response.analysis || response.headline || "",
    narrative: response,
    confidence_label: response.confidence_label,
    partial_context: response.partial_context,
    data_sources: response.data_sources,
    timestamp: Date.now(),
  };
}

function makeErrorMsg(): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "ai",
    content: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
    timestamp: Date.now(),
  };
}

const SUGGESTIONS = [
  "O que mudou no 2º tempo?",
  "Tem risco de virada?",
  "Qual a tendência de gols?",
  "Análise do árbitro",
];

interface MatchChatProps {
  eventId: string;
}

export function MatchChat({ eventId }: MatchChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { getOrCreateSession, addMessage, setTyping, clearSession } = useChatStore();
  const session = useChatStore((s) => s.sessions[eventId] ?? null);
  const askMutation = useAskQuestion();
  const deleteMutation = useDeleteHistory();

  const currentSession = session ?? getOrCreateSession(eventId);
  const { messages, isTyping, sessionId } = currentSession;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text?: string) {
    const msg = text ?? input.trim();
    if (!msg || isTyping) return;

    addMessage(makeUserMsg(msg), eventId);
    setInput("");
    setTyping(true, eventId);

    askMutation.mutate(
      { question: msg, eventId, sessionId },
      {
        onSuccess: (response) => {
          addMessage(makeAiMsg(response), eventId);
          setTyping(false, eventId);
        },
        onError: () => {
          addMessage(makeErrorMsg(), eventId);
          setTyping(false, eventId);
        },
      },
    );
  }

  function handleClear() {
    deleteMutation.mutate(
      { eventId, sessionId },
      { onSettled: () => clearSession(eventId) },
    );
  }

  return (
    <div className="bg-card border border-border rounded-[14px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#012AFE] flex items-center justify-center">
            <div className="relative w-4 h-4">
              <Image src="/goat-tips-logo.svg" alt="" fill className="object-contain brightness-0 invert" />
            </div>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-(--text)">Chat da Partida</div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D68F]" />
              <span className="text-[10px] text-(--text3)">IA ativa</span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="text-[11px] text-(--text3) hover:text-[#FF3B3B] transition-colors cursor-pointer"
          >
            Limpar conversa
          </button>
        )}
      </div>

      {/* Sugestões */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto border-b border-border" style={{ scrollbarWidth: "none" }}>
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug}
            onClick={() => sendMessage(sug)}
            disabled={isTyping}
            className="shrink-0 bg-(--pill-bg) border border-(--pill-border) rounded-full px-3 py-1.5 text-[11px] text-(--text2) font-medium cursor-pointer hover:bg-(--blue-dim) hover:border-(--blue-mid) hover:text-[#012AFE] transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Mensagens */}
      <div className="flex flex-col gap-3 px-5 py-4 max-h-[480px] overflow-y-auto min-h-[200px]">
        {messages.length === 0 && !isTyping && (
          <div className="text-center text-[13px] text-(--text3) py-10">
            Faça uma pergunta sobre esta partida
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
                  <Image src="/goat-tips-logo.svg" alt="" fill className="object-contain brightness-0 invert" />
                </div>
              </div>
            )}

            <div className={`${msg.role === "user" ? "max-w-[80%]" : "flex-1 min-w-0"}`}>
              {msg.role === "user" ? (
                <div className="bg-[#012AFE] text-white rounded-[14px] rounded-tr-[4px] px-3.5 py-2.5 text-[13px] leading-[1.55]">
                  {msg.content}
                </div>
              ) : (
                <AiMessageBubble msg={msg} compact />
              )}
            </div>
          </div>
        ))}

        {/* Digitando */}
        {isTyping && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-[#012AFE] flex items-center justify-center shrink-0">
              <div className="relative w-4 h-4">
                <Image src="/goat-tips-logo.svg" alt="" fill className="object-contain brightness-0 invert" />
              </div>
            </div>
            <div className="bg-(--bg2) border border-border rounded-[14px] rounded-bl-[4px] px-3.5 py-3">
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
      <div className="px-4 py-3 border-t border-border flex gap-2.5 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Pergunte sobre a partida..."
          disabled={isTyping}
          className="flex-1 bg-(--bg3) border border-border rounded-xl px-4 py-2.5 text-[13px] text-(--text) outline-none focus:border-(--blue-mid) transition-colors placeholder:text-(--text3) disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage()}
          disabled={isTyping || !input.trim()}
          className="w-10 h-10 bg-[#012AFE] rounded-xl text-white flex items-center justify-center shrink-0 cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M13 8L3 3l2 5-2 5 10-5z" fill="white" />
          </svg>
        </button>
      </div>
    </div>
  );
}
