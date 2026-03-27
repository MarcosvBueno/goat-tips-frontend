"use client";

import { useMemo } from "react";
import { Rainify } from "rainify";
import type { WeatherResponse } from "@/types/api";

interface WeatherOverlayProps {
  weather: WeatherResponse;
}

/**
 * Subtle full-page weather particle overlay using Rainify.
 * Configures the effect based on the weather conditions (rain vs snow).
 */
export function WeatherOverlay({ weather }: WeatherOverlayProps) {
  const condition = weather.condition?.toLowerCase() ?? "";
  const isRain = ["rain", "drizzle", "storm"].includes(condition);
  const isSnow = condition === "snow";

  const config = useMemo(() => {
    if (isRain) {
      return {
        intensity: 300,
        color: "rgba(160, 196, 232, 0.5)",
        speed: 2,
        wind: -4,
        thickness: 0.5,
        splashColor: "rgba(160, 196, 232, 0.05)",
        splashDuration: 5,
        splash: 1,
      };
    }

    if (isSnow) {
      return {
        intensity: 40,
        color: "rgba(255, 255, 255, 0.6)",
        speed: 0.5,
        wind: 1.2,
        thickness: 3,
        splashColor: "transparent",
        splashDuration: 0,
      };
    }

    return null;
  }, [isRain, isSnow]);

  if (!config) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      <Rainify
        isRaining={true}
        intensity={config.intensity}
        color={config.color}
        speed={config.speed}
        wind={config.wind}
        thickness={config.thickness}
        splashColor={config.splashColor}
        splashDuration={config.splashDuration}
        zIndex={1}
      />
    </div>
  );
}
