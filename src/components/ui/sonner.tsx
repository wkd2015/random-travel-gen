"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-white/10 bg-black/90 text-white shadow-xl backdrop-blur-xl",
          title: "text-sm font-medium",
          description: "text-xs text-white/70",
        },
      }}
    />
  );
}


