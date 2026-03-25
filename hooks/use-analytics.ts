import { useQuery } from "@tanstack/react-query";
import {
  getTeams,
  getTeamForm,
  getTeamStats,
  getTeamProfile,
  getAnalyticsH2H,
  getGoalPatterns,
  getCardPatterns,
  getRiskScores,
  getReferees,
  getRefereeStats,
  getWeather,
  getCalibration,
} from "@/services/analytics";

export function useTeams() {
  return useQuery({
    queryKey: ["analytics", "teams"],
    queryFn: getTeams,
    staleTime: Infinity,
  });
}

export function useTeamForm(teamName: string | undefined, n = 10) {
  return useQuery({
    queryKey: ["analytics", "teams", teamName, "form", n],
    queryFn: () => getTeamForm(teamName!, n),
    enabled: !!teamName,
    staleTime: 600_000,
  });
}

export function useTeamStats(teamName: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "teams", teamName, "stats"],
    queryFn: () => getTeamStats(teamName!),
    enabled: !!teamName,
    staleTime: 600_000,
  });
}

export function useTeamProfile(teamName: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "teams", teamName, "profile"],
    queryFn: () => getTeamProfile(teamName!),
    enabled: !!teamName,
    staleTime: 600_000,
  });
}

export function useAnalyticsH2H(
  home: string | undefined,
  away: string | undefined,
  n = 10,
) {
  return useQuery({
    queryKey: ["analytics", "h2h", home, away, n],
    queryFn: () => getAnalyticsH2H(home!, away!, n),
    enabled: !!home && !!away,
    staleTime: 600_000,
  });
}

export function useGoalPatterns() {
  return useQuery({
    queryKey: ["analytics", "goal-patterns"],
    queryFn: getGoalPatterns,
    staleTime: Infinity,
  });
}

export function useCardPatterns() {
  return useQuery({
    queryKey: ["analytics", "card-patterns"],
    queryFn: getCardPatterns,
    staleTime: Infinity,
  });
}

export function useRiskScores(
  minute: number | undefined,
  scoreDiff: number | undefined,
) {
  return useQuery({
    queryKey: ["analytics", "risk-scores", minute, scoreDiff],
    queryFn: () => getRiskScores(minute!, scoreDiff!),
    enabled: minute !== undefined && scoreDiff !== undefined,
  });
}

export function useReferees() {
  return useQuery({
    queryKey: ["analytics", "referees"],
    queryFn: getReferees,
    staleTime: Infinity,
  });
}

export function useRefereeStats(refereeName: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "referees", refereeName, "stats"],
    queryFn: () => getRefereeStats(refereeName!),
    enabled: !!refereeName,
    staleTime: 600_000,
  });
}

export function useWeather(stadium: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "weather", stadium],
    queryFn: () => getWeather({ stadium: stadium! }),
    enabled: !!stadium,
    staleTime: 86_400_000,
  });
}

export function useCalibration(n = 500) {
  return useQuery({
    queryKey: ["analytics", "calibration", n],
    queryFn: () => getCalibration(n),
    staleTime: Infinity,
  });
}
