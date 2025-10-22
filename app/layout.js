export const metadata = {
  title: "Replai",
  description: "Client chat links",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0b0c", color: "#fff", fontFamily: "ui-sans-serif, system-ui, Arial" }}>
        {children}
      </body>
    </html>
  );
}
