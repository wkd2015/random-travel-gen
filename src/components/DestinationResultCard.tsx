"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export type Destination = {
  id: number;
  country_code: string;
  name_en: string;
  name_local: string;
  lat: number;
  lng: number;
  level: string;
  image_url: string | null;
};

type Props = {
  destination?: Destination | null;
  open: boolean;
  lang?: string;
  originLabel?: string;
};

type WikiSummary = {
  title: string;
  extract: string;
  url: string;
};

export function DestinationResultCard({
  destination,
  open,
  lang = "en",
  originLabel = "Global",
}: Props) {
  const [activeTab, setActiveTab] = useState<"wiki" | "ai">("wiki");
  const [wiki, setWiki] = useState<WikiSummary | null>(null);
  const [loadingWiki, setLoadingWiki] = useState(false);
  const [aiText, setAiText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);

  // Wikipedia summary
  useEffect(() => {
    if (!destination || !open) return;
    setWiki(null);
    setLoadingWiki(true);

    const controller = new AbortController();

    const fetchWiki = async () => {
      try {
        const title = encodeURIComponent(destination.name_en);
        const resp = await fetch(
          `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`,
          { signal: controller.signal },
        );
        if (!resp.ok) throw new Error("wiki error");
        const data = await resp.json();
        setWiki({
          title: data.title,
          extract: data.extract,
          url:
            data.content_urls?.desktop?.page ??
            data.content_urls?.mobile?.page ??
            "",
        });
      } catch {
        const msg =
          lang === "zh"
            ? "维基百科内容加载失败，请稍后重试。"
            : "Failed to load Wikipedia summary. Please try again later.";
        toast.error(msg);
        setWiki(null);
      } finally {
        setLoadingWiki(false);
      }
    };

    fetchWiki();

    return () => controller.abort();
  }, [destination, open, lang]);

  const loadAI = async () => {
    if (!destination) return;
    setLoadingAI(true);
    setAiText("");

    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: originLabel,
          city: destination.name_en,
          lang,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setAiText(data.text);
      } else {
        const msg =
          lang === "zh"
            ? "AI 旅行建议加载失败，请稍后重试。"
            : "AI insights failed to load. Please try again.";
        toast.error(msg);
        setAiText("");
      }
    } catch {
      const msg =
        lang === "zh"
          ? "AI 旅行建议加载失败，请检查网络后重试。"
          : "AI insights failed to load. Please check your network and try again.";
      toast.error(msg);
      setAiText("");
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ai" && aiText === "" && open) {
      void loadAI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, open]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?city=${encodeURIComponent(destination.name_en)}`;
    const shareText =
      lang === "zh"
        ? `我随机抽到了：${destination.name_en}！用飞镖在地图上选旅行目的地 🎯`
        : `I got: ${destination.name_en}! Random travel destination generator 🎯`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error, fallback to copy
        await copyToClipboard(shareUrl);
      }
    } else {
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      const msg =
        lang === "zh" ? "链接已复制到剪贴板" : "Link copied to clipboard";
      toast.success(msg);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const msg =
        lang === "zh" ? "复制失败，请手动复制" : "Failed to copy";
      toast.error(msg);
    }
  };

  return (
    <AnimatePresence>
      {open && destination && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-4 left-1/2 z-30 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-3xl border border-white/15 bg-black/80 text-white shadow-2xl backdrop-blur-xl"
        >
          {destination.image_url && (
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={destination.image_url}
                alt={destination.name_en}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-xs uppercase tracking-[0.25em] text-white/70">
                  {destination.country_code} · {destination.level}
                </div>
                <div className="text-2xl font-semibold">
                  {destination.name_en}
                  <span className="ml-2 text-base text-white/70">
                    {destination.name_local}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 ${
                    activeTab === "wiki"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/70"
                  }`}
                  onClick={() => setActiveTab("wiki")}
                >
                  Wiki
                </button>
                <button
                  type="button"
                  className={`rounded-full px-3 py-1 ${
                    activeTab === "ai"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/70"
                  }`}
                  onClick={() => setActiveTab("ai")}
                >
                  AI Insights
                </button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-7 gap-1.5 text-xs text-white/70 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    {lang === "zh" ? "已复制" : "Copied"}
                  </>
                ) : (
                  <>
                    <Share2 className="h-3 w-3" />
                    {lang === "zh" ? "分享" : "Share"}
                  </>
                )}
              </Button>
            </div>

            {activeTab === "wiki" && (
              <div className="text-sm leading-relaxed">
                {loadingWiki && (
                  <p className="text-white/60">Loading Wikipedia summary…</p>
                )}
                {!loadingWiki && wiki && (
                  <>
                    <p className="mb-2 text-white/90">{wiki.extract}</p>
                    {wiki.url && (
                      <a
                        href={wiki.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-white/70 underline"
                      >
                        Open on Wikipedia ↗
                      </a>
                    )}
                  </>
                )}
                {!loadingWiki && !wiki && (
                  <p className="text-white/60">No Wikipedia summary found.</p>
                )}
              </div>
            )}

            {activeTab === "ai" && (
              <div className="text-sm leading-relaxed">
                {loadingAI && (
                  <p className="text-white/60">Asking AI travel guide…</p>
                )}
                {!loadingAI && aiText && (
                  <p className="text-white/90 whitespace-pre-line">{aiText}</p>
                )}
                {!loadingAI && !aiText && (
                  <p className="text-white/60">No AI response yet.</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


