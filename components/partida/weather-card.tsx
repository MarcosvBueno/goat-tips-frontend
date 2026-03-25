import type { WeatherResponse } from "@/types/api";

const WEATHER_ICONS: Record<string, string> = {
  clear: "☀️",
  cloudy: "☁️",
  drizzle: "🌧️",
  rain: "🌧️",
  snow: "🌨️",
  storm: "⛈️",
};

interface WeatherCardProps {
  weather: WeatherResponse;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const icon = WEATHER_ICONS[weather.condition] ?? "🌤️";
  const impactColor =
    weather.impact === "severo"
      ? "#FF3B3B"
      : weather.impact === "moderado"
        ? "#FFB800"
        : weather.impact === "leve"
          ? "#FFB800"
          : "#00C896";

  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div
        className="text-[14px] uppercase tracking-[0.04em] text-(--text2) mb-3 font-semibold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Clima
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[36px]">{icon}</span>
        <div>
          <div className="text-[16px] font-semibold text-(--text)">
            {weather.description}
          </div>
          <div className="text-[12px] text-(--text2)">
            {weather.temperature_c.toFixed(1)}°C · Vento {weather.wind_speed_kmh.toFixed(0)} km/h
          </div>
          {weather.precipitation_mm > 0 && (
            <div className="text-[12px] text-(--text3)">
              Precipitação: {weather.precipitation_mm.toFixed(1)} mm
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-[11px] text-(--text3)">Impacto em gols:</span>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded capitalize"
          style={{
            background: `${impactColor}15`,
            color: impactColor,
          }}
        >
          {weather.impact}
        </span>
        <span className="text-[11px] text-(--text3)">
          (fator: {weather.goal_factor.toFixed(3)})
        </span>
      </div>
    </div>
  );
}
