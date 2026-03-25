// ── Team & Match ─────────────────────────────────────────────────────────────

export interface ApiTeamInfo {
  id: string;
  name: string;
  image_url?: string;
}

export interface Odds {
  home_win: number;
  draw: number;
  away_win: number;
}

export interface Probabilities {
  home_win: number;
  draw: number;
  away_win: number;
  market_margin?: number;
}

export interface Match {
  event_id: string;
  home: ApiTeamInfo;
  away: ApiTeamInfo;
  minute: number | null;
  score_home: number;
  score_away: number;
  status: "live" | "upcoming" | "ended";
  odds?: Odds;
  probabilities?: Probabilities;
  kick_off_time: string;
  round?: string;
  referee?: string;
  stadium?: string;
}

// ── H2H ──────────────────────────────────────────────────────────────────────

export interface H2HMatch {
  event_id: string;
  date: string;
  home_team: string;
  away_team: string;
  score_home: number;
  score_away: number;
  winner: "home" | "away" | "draw";
}

export interface H2HResponse {
  home_team: string;
  away_team: string;
  total_matches: number;
  home_wins: number;
  away_wins: number;
  draws: number;
  home_goals_avg: number;
  away_goals_avg: number;
  last_matches: H2HMatch[];
}

// ── Stats Trend ──────────────────────────────────────────────────────────────

export interface StatsPeriod {
  period: string;
  home_shots: number;
  away_shots: number;
  home_corners: number;
  away_corners: number;
  home_dangerous_attacks: number;
  away_dangerous_attacks: number;
  home_possession: number;
  away_possession: number;
}

export interface StatsTrend {
  event_id: string;
  periods: StatsPeriod[];
  momentum_score: number;
  momentum_label: string;
}

// ── Lineup ───────────────────────────────────────────────────────────────────

export interface Player {
  name: string;
  number: number;
  position: string;
}

export interface LineupTeam {
  team: { name: string };
  formation: string;
  starting_xi: Player[];
  substitutes: Player[];
}

export interface Lineup {
  event_id: string;
  home: LineupTeam;
  away: LineupTeam;
}

// ── Toplist ──────────────────────────────────────────────────────────────────

export interface ToplistResponse {
  [key: string]: unknown;
}

// ── Prediction ───────────────────────────────────────────────────────────────

export interface HalfTimePrediction {
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
  over_0_5_prob: number;
  over_1_5_prob: number;
  most_likely_score: string;
  lambda_home: number;
  lambda_away: number;
}

export interface Prediction {
  home_team: string;
  away_team: string;
  lambda_home: number;
  lambda_away: number;
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
  over_2_5_prob: number;
  btts_prob: number;
  most_likely_score: string;
  most_likely_score_prob: number;
  top_scores: [string, number][];
  score_matrix: number[][];
  confidence: string;
  model_note: string;
  weather_factor?: number;
  weather_condition?: string;
  half_time?: HalfTimePrediction;
}

// ── Narrative / Ask ──────────────────────────────────────────────────────────

export interface NarrativeResponse {
  match_id?: string;
  headline: string;
  analysis: string;
  prediction: string;
  momentum_signal?: string;
  confidence_label: string;
  confidence_score?: number;
  data_sources?: string[];
  partial_context?: boolean;
  agent_trace_id?: string;
}

// ── Full Analysis ────────────────────────────────────────────────────────────

export interface TeamForm {
  team_name: string;
  last_n_matches: number;
  form_string: string;
  wins: number;
  draws: number;
  losses: number;
  avg_goals_scored: number;
  avg_goals_conceded: number;
  matches: {
    event_id: string;
    date: string;
    opponent: string;
    home_or_away: string;
    goals_scored: number;
    goals_conceded: number;
    result: string;
  }[];
}

export interface FullAnalysis {
  match: Match;
  narrative: NarrativeResponse;
  prediction: Prediction;
  h2h: H2HResponse;
  stats_trend: StatsTrend;
  lineup: Lineup;
  home_form: TeamForm;
  away_form: TeamForm;
  goal_risk_score: number;
  card_risk_score: number;
  agent_steps: string[];
}

// ── Analytics: Team ──────────────────────────────────────────────────────────

export interface TeamListResponse {
  teams: { id: string; name: string }[];
  total: number;
}

export interface TeamStats {
  team_name: string;
  sample_size: number;
  win_rate: number;
  draw_rate: number;
  avg_goals_scored: number;
  avg_goals_conceded: number;
  clean_sheet_rate: number;
  btts_rate: number;
}

export interface TeamProfile {
  team_name: string;
  sample_size: number;
  avg_shots_on_target: number;
  avg_goals_scored: number;
  shot_efficiency: number;
  avg_xg: number;
  goals_by_half: {
    first_half_avg: number;
    second_half_avg: number;
    first_half_pct: number;
  };
  home_win_rate: number;
  away_win_rate: number;
  home_goals_avg: number;
  away_goals_avg: number;
}

// ── Analytics: Patterns ──────────────────────────────────────────────────────

export interface PatternBucket {
  minute_range: string;
  goals?: number;
  yellows?: number;
  reds?: number;
  pct_of_total: number;
}

export interface GoalPatterns {
  total_goals: number;
  avg_goals_per_match: number;
  peak_minute_range: string;
  buckets: PatternBucket[];
}

export interface CardPatterns {
  total_yellows: number;
  total_reds: number;
  peak_minute_range: string;
  buckets: PatternBucket[];
}

// ── Analytics: Risk ──────────────────────────────────────────────────────────

export interface RiskScore {
  score: number;
  label: string;
}

export interface RiskScores {
  minute: number;
  score_diff: number;
  goal_risk: RiskScore;
  card_risk: RiskScore;
}

// ── Analytics: Referee ───────────────────────────────────────────────────────

export interface RefereeListResponse {
  referees: string[];
  total: number;
}

export interface RefereeStats {
  referee_name: string;
  matches: number;
  avg_yellow_cards: number;
  avg_red_cards: number;
  avg_fouls: number;
  home_win_rate: number;
}

// ── Analytics: Weather ───────────────────────────────────────────────────────

export interface WeatherResponse {
  stadium: string | null;
  city: string | null;
  weather_code: number;
  condition: string;
  description: string;
  precipitation_mm: number;
  wind_speed_kmh: number;
  temperature_c: number;
  goal_factor: number;
  source: string;
  impact: string;
}

// ── Analytics: Calibration ───────────────────────────────────────────────────

export interface CalibrationBin {
  bin: string;
  avg_predicted: number;
  avg_actual: number;
  n: number;
}

export interface CalibrationMarket {
  brier_score: number;
  avg_predicted: number;
  avg_actual: number;
}

export interface CalibrationResponse {
  n_matches: number;
  markets: Record<string, CalibrationMarket>;
  calibration_bins: Record<string, CalibrationBin[]>;
}

// ── Chat UI ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  narrative?: NarrativeResponse;
  confidence_label?: string;
  partial_context?: boolean;
  data_sources?: string[];
  timestamp: number;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  isTyping: boolean;
}

// ── API Error ────────────────────────────────────────────────────────────────

export interface ApiErrorBody {
  detail: string;
}
