import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") ?? "GLOBAL";
  const level = searchParams.get("level") ?? "any";

  const { data, error } = await supabaseAdmin.rpc("get_random_destination", {
    target_country: country,
    target_level: level,
  });

  if (error) {
    console.error("[random-destination] supabase error", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "No destination found" },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}


