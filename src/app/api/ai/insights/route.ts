import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const origin = body.origin ?? "Global";
  const city = body.city as string | undefined;
  const lang = (body.lang as string | undefined) ?? "en";

  if (!city) {
    return NextResponse.json({ error: "city is required" }, { status: 400 });
  }

  const prompt =
    lang === "zh"
      ? `你是一名旅游向导。请简要估算从${origin}前往${city}的旅行费用（便宜/适中/昂贵），并给出最佳交通方式和一个必去景点，总字数控制在100词以内。`
      : `You are a travel guide. Briefly estimate the travel cost from ${origin} to ${city} (Cheap / Moderate / Expensive), suggest the best way to get there, and name one must-visit spot. Keep it under 100 words.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a concise, practical travel guide." },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  return NextResponse.json({ text });
}


