"use client";

import { useState } from "react";
import { RandomizerMap } from "@/components/map/RandomizerMap";
import {
  Destination,
  DestinationResultCard,
} from "@/components/DestinationResultCard";

function getCountryLabel(code: string) {
  const upper = code.toUpperCase();
  switch (upper) {
    case "US":
      return "United States";
    case "CN":
      return "China / 中国";
    case "JP":
      return "Japan / 日本";
    case "FR":
      return "France";
    case "TH":
      return "Thailand / ประเทศไทย";
    case "GLOBAL":
    default:
      return "Global";
  }
}

export function HomeClient() {
  const [country, setCountry] = useState<string>("GLOBAL");
  const [level, setLevel] = useState<string>("any");
  const [destination, setDestination] = useState<Destination | null>(null);
  const [animateKey, setAnimateKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGo = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        country,
        level,
      });
      const res = await fetch(`/api/random-destination?${params.toString()}`);
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch random destination");
        return;
      }
      const data = (await res.json()) as Destination;
      setDestination(data);
      setAnimateKey((k) => k + 1);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-black via-slate-950 to-slate-900 px-4 pb-10 pt-8 text-white">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
            Random Travel · MVP
          </div>
          <h1 className="text-balance text-3xl font-semibold sm:text-4xl md:text-5xl">
            Throw a dart at the map,{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              discover your next city
            </span>
          </h1>
          <p className="max-w-2xl text-balance text-sm text-white/70 sm:text-base">
            Pick a country or go global. We spin the globe, zoom into a random
            city, pull a quick Wiki summary and ask AI for budget &amp; travel
            tips.
          </p>
        </header>

        <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">
              Country
            </span>
            <select
              className="rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-sm outline-none"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="GLOBAL">🌍 Global</option>
              <option value="US">🇺🇸 United States</option>
              <option value="CN">🇨🇳 China</option>
              <option value="JP">🇯🇵 Japan</option>
              <option value="FR">🇫🇷 France</option>
              <option value="TH">🇹🇭 Thailand</option>
            </select>

            <span className="ml-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Vibe
            </span>
            <select
              className="rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-sm outline-none"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="any">🎯 Any</option>
              <option value="city">🏙 City</option>
              <option value="beach">🏖 Beach</option>
              <option value="island">🏝 Island</option>
              <option value="nature">⛰ Nature</option>
              <option value="culture">🏛 Culture</option>
              <option value="wine">🍷 Wine</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleGo}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-600/60"
          >
            {loading ? "Spinning the globe…" : "Throw a dart 🎯"}
          </button>
        </section>

        <section className="mt-2">
          <RandomizerMap
            destination={
              destination
                ? {
                    lat: destination.lat,
                    lng: destination.lng,
                    name_en: destination.name_en,
                    name_local: destination.name_local,
                  }
                : undefined
            }
            animateKey={animateKey}
            height={520}
          />
        </section>
      </main>

      <DestinationResultCard
        destination={destination}
        open={Boolean(destination)}
        lang="en"
        originLabel={getCountryLabel(country)}
      />
    </div>
  );
}


