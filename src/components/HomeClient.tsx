"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RandomizerMap } from "@/components/map/RandomizerMap";
import { Destination, DestinationResultCard } from "@/components/DestinationResultCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type HomeClientProps = {
  lang?: "en" | "zh";
  initialCountry?: string;
};

export function HomeClient({ lang = "en", initialCountry = "GLOBAL" }: HomeClientProps) {
  const [country, setCountry] = useState<string>(initialCountry);
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
        const msg =
          lang === "zh"
            ? "没有找到目的地，请稍后重试。"
            : "No destination found. Please try again.";
        toast.error(msg);
        return;
      }
      const data = (await res.json()) as Destination;
      setDestination(data);
      setAnimateKey((k) => k + 1);
    } catch (error) {
      const msg =
        lang === "zh"
          ? "获取随机目的地失败，请检查网络后重试。"
          : "Failed to fetch a random destination. Please check your network and try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-black via-slate-950 to-slate-900 px-4 pb-10 pt-8 text-white">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
            {lang === "zh" ? "随机旅行 · MVP" : "Random Travel · MVP"}
          </div>
          <h1 className="text-balance text-3xl font-semibold sm:text-4xl md:text-5xl">
            {lang === "zh" ? "向地图扔一支飞镖，" : "Throw a dart at the map, "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              {lang === "zh" ? "发现下一个目的地" : "discover your next city"}
            </span>
          </h1>
          <p className="max-w-2xl text-balance text-sm text-white/70 sm:text-base">
            {lang === "zh"
              ? "选择一个国家或直接全球随机，我们旋转地球、放大到随机城市，并提供维基百科摘要和 AI 旅行建议。"
              : "Pick a country or go global. We spin the globe, zoom into a random city, pull a quick Wiki summary and ask AI for budget & travel tips."}
          </p>
        </header>

        <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">
              {lang === "zh" ? "国家" : "Country"}
            </span>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="min-w-[9rem]">
                <SelectValue
                  placeholder={lang === "zh" ? "选择国家" : "Select country"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GLOBAL">🌍 Global</SelectItem>
                <SelectItem value="US">🇺🇸 United States</SelectItem>
                <SelectItem value="CN">🇨🇳 China / 中国</SelectItem>
                <SelectItem value="JP">🇯🇵 Japan / 日本</SelectItem>
                <SelectItem value="FR">🇫🇷 France</SelectItem>
                <SelectItem value="TH">🇹🇭 Thailand / ประเทศไทย</SelectItem>
              </SelectContent>
            </Select>

            <span className="ml-2 text-xs uppercase tracking-[0.3em] text-white/60">
              {lang === "zh" ? "氛围" : "Vibe"}
            </span>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="min-w-[8rem]">
                <SelectValue
                  placeholder={lang === "zh" ? "任意" : "Any"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">🎯 Any</SelectItem>
                <SelectItem value="city">🏙 City</SelectItem>
                <SelectItem value="beach">🏖 Beach</SelectItem>
                <SelectItem value="island">🏝 Island</SelectItem>
                <SelectItem value="nature">⛰ Nature</SelectItem>
                <SelectItem value="culture">🏛 Culture</SelectItem>
                <SelectItem value="wine">🍷 Wine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="button" onClick={handleGo} disabled={loading} size="lg">
            {loading
              ? lang === "zh"
                ? "正在旋转地球…"
                : "Spinning the globe…"
              : lang === "zh"
                ? "扔出飞镖 🎯"
                : "Throw a dart 🎯"}
          </Button>
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
        lang={lang}
        originLabel={getCountryLabel(country)}
      />
    </div>
  );
}


