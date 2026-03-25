import { create } from "zustand";

interface MatchStore {
  selectedEventId: string | null;
  liveMatchIds: Set<string>;
  selectMatch: (id: string | null) => void;
  setLiveMatchIds: (ids: string[]) => void;
  isLive: (id: string) => boolean;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  selectedEventId: null,
  liveMatchIds: new Set(),

  selectMatch: (id) => set({ selectedEventId: id }),

  setLiveMatchIds: (ids) => set({ liveMatchIds: new Set(ids) }),

  isLive: (id) => get().liveMatchIds.has(id),
}));
