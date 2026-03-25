import { create } from "zustand";
import type { ChatMessage, ChatSession } from "@/types/api";

const GLOBAL_KEY = "__global__";

interface ChatStore {
  sessions: Record<string, ChatSession>;

  getOrCreateSession: (eventId?: string) => ChatSession;
  addMessage: (msg: ChatMessage, eventId?: string) => void;
  setTyping: (isTyping: boolean, eventId?: string) => void;
  clearSession: (eventId?: string) => void;
}

function createSession(): ChatSession {
  return {
    sessionId: crypto.randomUUID(),
    messages: [],
    isTyping: false,
  };
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: {},

  getOrCreateSession: (eventId) => {
    const key = eventId ?? GLOBAL_KEY;
    const existing = get().sessions[key];
    if (existing) return existing;

    const session = createSession();
    set((state) => ({
      sessions: { ...state.sessions, [key]: session },
    }));
    return session;
  },

  addMessage: (msg, eventId) => {
    const key = eventId ?? GLOBAL_KEY;
    set((state) => {
      const session = state.sessions[key] ?? createSession();
      return {
        sessions: {
          ...state.sessions,
          [key]: {
            ...session,
            messages: [...session.messages, msg],
          },
        },
      };
    });
  },

  setTyping: (isTyping, eventId) => {
    const key = eventId ?? GLOBAL_KEY;
    set((state) => {
      const session = state.sessions[key];
      if (!session) return state;
      return {
        sessions: {
          ...state.sessions,
          [key]: { ...session, isTyping },
        },
      };
    });
  },

  clearSession: (eventId) => {
    const key = eventId ?? GLOBAL_KEY;
    set((state) => {
      const newSessions = { ...state.sessions };
      delete newSessions[key];
      return { sessions: newSessions };
    });
  },
}));
