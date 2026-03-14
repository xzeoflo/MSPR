import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark h-full overflow-hidden">
      <body className="h-full bg-background antialiased">{children}</body>
    </html>
  );
}
