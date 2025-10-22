import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body?.message || !body?.slug) {
    return NextResponse.json({ reply: "Missing details. Try again?" }, { status: 200 });
  }

  const url = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_PUBLIC_SECRET || "";

  if (!url) {
    // simple canned demo without n8n
    const lower = body.message.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi")) {
      return NextResponse.json({ reply: `Hello! I’m ${body.slug}’s assistant. What can I do for you?` });
    }
    if (lower.includes("book")) {
      return NextResponse.json({ reply: "Sure — what day and time should I book?" });
    }
    return NextResponse.json({ reply: `You said: “${body.message}”. (Connect n8n to customize this.)` });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-REPLAI-SECRET": secret },
      body: JSON.stringify({ slug: body.slug, message: body.message, conversation_id: body.conversation_id || null })
    });
    const data = await res.json().catch(async () => ({ reply: await res.text() }));
    return NextResponse.json({ reply: data?.reply ?? "" });
  } catch {
    return NextResponse.json({ reply: "Upstream error. Please try again." }, { status: 200 });
  }
}
