import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Random Travel Destination Generator - Throw a Dart at the Map",
  description:
    "Discover random travel destinations with a virtual dart. Spin the globe, get AI-powered travel tips, and find your next adventure. Free tool, no signup required.",
  keywords: [
    "random travel destination",
    "random destination generator",
    "where should I travel",
    "random vacation picker",
    "travel destination generator",
  ],
  openGraph: {
    title: "Random Travel Destination Generator",
    description:
      "Throw a virtual dart at the world map and discover random travel destinations with AI-powered travel tips.",
    type: "website",
  },
};

export default function Home() {
  return <LandingPage />;
}

