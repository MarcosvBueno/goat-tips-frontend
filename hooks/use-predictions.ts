import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPredictionById,
  getInplayById,
  getFullAnalysis,
  askQuestion,
  deleteHistory,
} from "@/services/predictions";
import type { NarrativeResponse } from "@/types/api";

export function usePredictionById(eventId: string | undefined) {
  return useQuery({
    queryKey: ["predictions", eventId],
    queryFn: () => getPredictionById(eventId!),
    enabled: !!eventId,
    staleTime: 300_000,
  });
}

export function useInplayPrediction(
  eventId: string | undefined,
  isLive = false,
) {
  return useQuery({
    queryKey: ["predictions", eventId, "inplay"],
    queryFn: () => getInplayById(eventId!),
    enabled: !!eventId && isLive,
    refetchInterval: isLive ? 30_000 : false,
  });
}

export function useFullAnalysis(eventId: string | undefined) {
  return useQuery({
    queryKey: ["predictions", eventId, "full-analysis"],
    queryFn: () => getFullAnalysis(eventId!),
    enabled: false,
    staleTime: 600_000,
    retry: 1,
  });
}

export function useAskQuestion() {
  return useMutation<
    NarrativeResponse,
    Error,
    { question: string; eventId?: string; sessionId?: string }
  >({
    mutationFn: ({ question, eventId, sessionId }) =>
      askQuestion(question, eventId, sessionId),
  });
}

export function useDeleteHistory() {
  return useMutation<
    { cleared: boolean; session_id: string; event_id: string },
    Error,
    { eventId: string; sessionId: string }
  >({
    mutationFn: ({ eventId, sessionId }) => deleteHistory(eventId, sessionId),
  });
}
