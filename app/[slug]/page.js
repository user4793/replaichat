"use client";
import { useRef, useState, useEffect } from "react";

export default function ClientPage({ params }) {
  const slug = params.slug.toLowerCase();
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hi, I’m ${slug}’s assistant. How can I help?` }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [convId] = useState(() => crypto.randomUUID());
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");

    // lightweight typing stub
    const typingIndex = messages.length + 1;
    setMessages(m => [...m, { role: "assistant", text: "…" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, message: text, conversation_id: convId })
      });
      const data = await res.json().catch(async () => ({ reply: await res.text() }));
      setMessages(m => m.map((msg, i) =>
        i === typingIndex ? { role: "assistant", text: data?.reply || "No reply." } : msg
      ));
    } catch {
      setMessages(m => m.map((msg, i) =>
        i === typingIndex ? { role: "assistant", text: "Sorry — something went wrong." } : msg
      ));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="container" style={{ display:"grid", gap:16 }}>
      <div className="card">
        <div className="header" style={{ padding:16, paddingBottom:0 }}>
          <h2 style={{ margin:0 }}>Chat with {slug}</h2>
          <span className="id">replai.com/{slug}</span>
        </div>

        {/* Canva header embed? uncomment below and paste your share URL */}
        {/* <iframe src="https://your-canva.canva.site" style={{ width:"100%", height:260, border:0, borderRadius:12, margin:16 }} /> */}

        <div ref={chatRef} className="chat">
          {messages.map((m, i) => (
            <div key={i} className="row" style={{ justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}>
              {m.role !== "user" && <div className="avatar">AI</div>}
              <div className={`bubble ${m.role==="user" ? "user" : "bot"}`}>{m.text}</div>
              {m.role === "user" && <div className="avatar" style={{ background:"#dfe3ff", color:"#111" }}>U</div>}
            </div>
          ))}
        </div>

        <form onSubmit={send} className="inputbar">
          <input
            className="input"
            placeholder={`Message ${slug}’s assistant…`}
            value={input}
            onChange={e=>setInput(e.target.value)}
          />
          <button className="btn" disabled={sending}>{sending ? "Sending…" : "Send"}</button>
        </form>
      </div>

      <div className="notice">Messages are processed by your workflow. Avoid sharing sensitive info.</div>
    </main>
  );
}

