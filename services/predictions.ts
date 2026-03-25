import { fetchApi } from "./api";
import type { Prediction, FullAnalysis, NarrativeResponse } from "@/types/api";

interface PredictionParams {
  home: string;
  away: string;
  referee?: string;
  stadium?: string;
  city?: string;
  match_hour_utc?: number;
}

interface InplayParams {
  home: string;
  away: string;
  home_goals: number;
  away_goals: number;
  minute: number;
  referee?: string;
  home_red?: number;
  away_red?: number;
}

function toQueryString(params: object) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export function getPrediction(params: PredictionParams) {
  return fetchApi<Prediction>(`/predictions/${toQueryString(params)}`);
}

export function getPredictionById(eventId: string) {
  return fetchApi<Prediction>(`/predictions/${eventId}`);
}

export function getInplayPrediction(params: InplayParams) {
  return fetchApi<Prediction>(`/predictions/inplay${toQueryString(params)}`);
}

export function getInplayById(eventId: string) {
  return fetchApi<Prediction>(`/predictions/${eventId}/inplay`);
}

export function getFullAnalysis(eventId: string) {
  return fetchApi<FullAnalysis>(`/predictions/${eventId}/full-analysis`);
}

export function askQuestion(
  question: string,
  eventId?: string,
  sessionId?: string,
) {
  const path = eventId
    ? `/predictions/${eventId}/ask`
    : "/predictions/ask";
  const qs = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";

  return fetchApi<NarrativeResponse>(`${path}${qs}`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export function deleteHistory(eventId: string, sessionId: string) {
  return fetchApi<{ cleared: boolean; session_id: string; event_id: string }>(
    `/predictions/${eventId}/ask/history?session_id=${encodeURIComponent(sessionId)}`,
    { method: "DELETE" },
  );
}

export function getNarrative(eventId: string) {
  return fetchApi<NarrativeResponse>(`/predictions/${eventId}/narrative`, {
    method: "POST",
  });
}
