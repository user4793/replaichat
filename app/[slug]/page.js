"use client";

import { useRef, useState, useEffect } from "react";

export default function ClientPage({ params }) {
  const slug = params.slug.toLowerCase();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [convId] = useState(() => crypto.randomUUID());
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages.length]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages(m => [...m, { role: "user", text }]);
    setInput("");

    // simple typing dot
    const typingIndex = messages.length + 1;
    setMessages(m => [...m, { role: "assistant", text: "…" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, message: text, conversation_id: convId })
      });

      const data = await res.json().catch(async () => ({ reply: await res.text() }));
      setMessages(m => m.map((msg, i) => i === typingIndex ? { role: "assistant", text: data?.reply || "No reply." } : msg));
    } catch {
      setMessages(m => m.map((msg, i) => i === typingIndex ? { role: "assistant", text: "Sorry — something went wrong." } : msg));
    }
  }

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Chat with {slug}</h1>
        <small style={{ opacity: 0.7 }}>replai.com/{slug}</small>
      </header>

      <section
        ref={chatRef}
        style={{
          background: "#131316",
          border: "1px solid #222",
          borderRadius: 12,
          padding: 16,
          minHeight: 420,
          maxHeight: "65vh",
          overflowY: "auto",
          display: "grid",
          gap: 8
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%",
              padding: "10px 12px",
              borderRadius: 12,
              background: m.role === "user" ? "#eee" : "#1b1b1f",
              color: m.role === "user" ? "#000" : "#fff",
              whiteSpace: "pre-wrap",
              lineHeight: 1.35
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </section>

      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message…"
          autoComplete="off"
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 10,
            border: "1px solid #222", background: "#0f0f12", color: "#fff"
          }}
        />
        <button style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #333", background: "#fff", color: "#000" }}>
          Send
        </button>
      </form>
    </main>
  );
}
