import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getCache, setCache, CACHE_KEYS } from "../offline/db";
import { useOnlineStatus } from "../offline/useOnlineStatus";
import type { Weather, WeatherExplainer } from "../types";

export function WeatherPage() {
  const online = useOnlineStatus();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [explainer, setExplainer] = useState<WeatherExplainer | null>(null);

  useEffect(() => {
    async function load() {
      if (online) {
        try {
          const w = await api.getWeather();
          setWeather(w);
          await setCache(CACHE_KEYS.weather, w);

          const e = await api.getWeatherExplainer();
          setExplainer(e);
          await setCache(CACHE_KEYS.weatherExplainer, e);
          return;
        } catch {
          // fall through to cache
        }
      }
      const cachedWeather = await getCache<Weather>(CACHE_KEYS.weather);
      const cachedExplainer = await getCache<WeatherExplainer>(CACHE_KEYS.weatherExplainer);
      if (cachedWeather) setWeather(cachedWeather);
      if (cachedExplainer) setExplainer(cachedExplainer);
    }
    load();
  }, [online]);

  return (
    <div>
      <h1>Weather &amp; Warnings</h1>
      <p>Status: {online ? "Live" : "Offline (last cached data)"}</p>

      {weather && (
        <div>
          <h2>{weather.location}</h2>
          <p>Condition: {weather.condition}</p>
          <p>Temperature: {weather.temperature_c}°C</p>
          <p>Wind: {weather.wind_kph} kph</p>
          <p>Rain: {weather.rain_mm} mm</p>
          <p>Last updated: {weather.fetched_at}</p>

          {weather.warnings.length > 0 && (
            <div>
              <h3>Warnings</h3>
              <ul>
                {weather.warnings.map((w, i) => (
                  <li key={i}>
                    {w.signal && <strong>Signal #{w.signal}: </strong>}
                    {w.headline} — {w.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {explainer && (
        <div>
          <h3>What this means (AI)</h3>
          <p>{explainer.summary}</p>
          <ul>
            {explainer.recommended_actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {!weather && <p>No weather data available.</p>}
    </div>
  );
}
