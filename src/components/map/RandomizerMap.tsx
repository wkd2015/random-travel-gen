"use client";

import { useEffect, useRef, useState } from "react";
import Map, { MapRef, ViewState } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

type DestinationPoint = {
  lat: number;
  lng: number;
  name_en?: string;
  name_local?: string;
};

type RandomizerMapProps = {
  destination?: DestinationPoint;
  animateKey?: string | number;
  height?: number | string;
};

export function RandomizerMap({
  destination,
  animateKey,
  height = 480,
}: RandomizerMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 20,
    longitude: 0,
    zoom: 1.2,
    pitch: 45,
    bearing: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  // 初始飞到全球视角
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [0, 20],
      zoom: 1.2,
      pitch: 45,
      bearing: 0,
      duration: 1500,
    });
  }, []);

  // 三次随机飞行 + 落到目标城市
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !destination || animateKey === undefined) return;

    let cancelled = false;

    const runAnimation = async () => {
      const randomFly = () =>
        new Promise<void>((resolve) => {
          if (cancelled) return resolve();
          const randLat = Math.random() * 160 - 80;
          const randLng = Math.random() * 360 - 180;
          const randZoom = 1.5 + Math.random() * 3.5;

          map.flyTo({
            center: [randLng, randLat],
            zoom: randZoom,
            pitch: 50,
            bearing: Math.random() * 360,
            duration: 800,
            essential: true,
          });

          setTimeout(() => resolve(), 850);
        });

      for (let i = 0; i < 3; i++) {
        if (cancelled) return;
        await randomFly();
      }

      if (cancelled) return;

      map.flyTo({
        center: [destination.lng, destination.lat],
        zoom: 9,
        pitch: 55,
        bearing: 20,
        duration: 1600,
        essential: true,
      });
    };

    runAnimation();

    return () => {
      cancelled = true;
    };
  }, [animateKey, destination]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60">
      <div style={{ height }}>
        <Map
          ref={mapRef}
          mapStyle="https://demotiles.maplibre.org/style.json"
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
        />
      </div>

      {/* 雷达十字线 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full border border-white/40" />
          <div className="absolute inset-4 rounded-full border border-white/25" />
          <div className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-white/70" />
          <div className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 bg-white/70" />
          <div className="absolute inset-0 animate-ping rounded-full border border-emerald-400/70" />
        </div>
      </div>
    </div>
  );
}



