import { useQuery } from "@tanstack/react-query";
import {
  getLiveMatches,
  getUpcomingMatches,
  getMatch,
  getH2H,
  getStatsTrend,
  getLineup,
  getToplist,
} from "@/services/matches";

export function useLiveMatches() {
  return useQuery({
    queryKey: ["matches", "live"],
    queryFn: getLiveMatches,
    refetchInterval: 30_000,
  });
}

export function useUpcomingMatches() {
  return useQuery({
    queryKey: ["matches", "upcoming"],
    queryFn: getUpcomingMatches,
    refetchInterval: 300_000,
  });
}

export function useMatch(eventId: string | undefined) {
  return useQuery({
    queryKey: ["matches", eventId],
    queryFn: () => getMatch(eventId!),
    enabled: !!eventId,
    refetchInterval: (query) => {
      const match = query.state.data;
      return match?.status === "live" ? 60_000 : false;
    },
  });
}

export function useH2H(eventId: string | undefined) {
  return useQuery({
    queryKey: ["matches", eventId, "h2h"],
    queryFn: () => getH2H(eventId!),
    enabled: !!eventId,
    staleTime: 600_000,
  });
}

export function useStatsTrend(eventId: string | undefined, isLive = false) {
  return useQuery({
    queryKey: ["matches", eventId, "stats-trend"],
    queryFn: () => getStatsTrend(eventId!),
    enabled: !!eventId,
    refetchInterval: isLive ? 120_000 : false,
  });
}

export function useLineup(eventId: string | undefined) {
  return useQuery({
    queryKey: ["matches", eventId, "lineup"],
    queryFn: () => getLineup(eventId!),
    enabled: !!eventId,
    staleTime: 600_000,
  });
}

export function useToplist() {
  return useQuery({
    queryKey: ["matches", "toplist"],
    queryFn: getToplist,
    staleTime: Infinity,
  });
}
