import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>
      <h1>Replai</h1>
      <p>Use links like <code>replai.com/lucy</code>, <code>replai.com/sam</code>, etc.</p>
      <p>
        Try a demo: <Link href="/lucy">/lucy</Link>
      </p>
    </main>
  );
}
