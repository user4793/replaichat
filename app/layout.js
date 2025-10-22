import "./globals.css";

export const metadata = {
  title: "Replai",
  description: "Client chat links",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ borderBottom: "1px solid #1e1e23", background: "rgba(12,12,14,.6)", backdropFilter: "blur(8px)" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop:12, paddingBottom:12 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:20, height:20, borderRadius:6, background:"#8ab4ff" }} />
              <strong>Replai</strong>
            </div>
            <div className="badge">Beta</div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
