"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black via-slate-950 to-slate-900 px-4 text-white">
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <header className="flex flex-col items-center gap-4">
          <div className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
            Random Travel Destination Generator
          </div>
          <h1 className="text-balance text-4xl font-semibold sm:text-5xl md:text-6xl">
            Throw a dart at the map,{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              discover your next city
            </span>
          </h1>
          <p className="max-w-2xl text-balance text-base text-white/70 sm:text-lg">
            Pick a country or go global. We spin the globe, zoom into a random
            city, pull a quick Wiki summary and ask AI for budget &amp; travel
            tips.
          </p>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="text-base">
            <Link href="/en/generator/global">Start in English</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base">
            <Link href="/zh/generator/global">中文开始</Link>
          </Button>
        </div>

        <div className="mt-8 text-xs text-white/50">
          <p>Free tool • No signup required • AI-powered travel insights</p>
        </div>
      </main>
    </div>
  );
}

