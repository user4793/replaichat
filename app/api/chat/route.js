import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body?.message || !body?.slug) {
    return NextResponse.json({ error: "Missing slug or message" }, { status: 400 });
  }

  // For now, just echo back. We’ll point this to n8n after deploy.
  // When you’re ready, set N8N_WEBHOOK_URL in Vercel and uncomment the fetch below.

  const url = process.env.N8N_WEBHOOK_URL;   // e.g. https://n8n.replai.com/webhook/chat
  const secret = process.env.N8N_PUBLIC_SECRET || ""; // optional

  if (!url) {
    // local fallback so you can see it working right away
    return NextResponse.json({ reply: `Hi ${body.slug} — you said: "${body.message}"` });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-REPLAI-SECRET": secret
      },
      body: JSON.stringify({
        slug: body.slug,
        message: body.message,
        conversation_id: body.conversation_id || null
      })
    });

    const data = await res.json().catch(async () => ({ reply: await res.text() }));
    return NextResponse.json({ reply: data?.reply ?? "" });
  } catch {
    return NextResponse.json({ error: "n8n error" }, { status: 502 });
  }
}
