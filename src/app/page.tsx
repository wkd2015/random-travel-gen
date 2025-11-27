import type { Metadata } from "next";
import { HomeClient } from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Random Travel Destination Generator",
  description:
    "Throw a virtual dart at the world map and discover a random travel destination, with cinematic map animation, Wikipedia info and AI travel tips.",
};

export default function Home() {
  return (
    <HomeClient />
  );
}

