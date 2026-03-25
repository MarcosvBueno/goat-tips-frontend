import { fetchApi } from "./api";
import type { Match, H2HResponse, StatsTrend, Lineup, ToplistResponse } from "@/types/api";

export function getLiveMatches() {
  return fetchApi<Match[]>("/matches/live");
}

export function getUpcomingMatches() {
  return fetchApi<Match[]>("/matches/upcoming");
}

export function getMatch(eventId: string) {
  return fetchApi<Match>(`/matches/${eventId}`);
}

export function getH2H(eventId: string) {
  return fetchApi<H2HResponse>(`/matches/${eventId}/h2h`);
}

export function getStatsTrend(eventId: string) {
  return fetchApi<StatsTrend>(`/matches/${eventId}/stats-trend`);
}

export function getLineup(eventId: string) {
  return fetchApi<Lineup>(`/matches/${eventId}/lineup`);
}

export function getToplist() {
  return fetchApi<ToplistResponse>("/matches/toplist");
}
