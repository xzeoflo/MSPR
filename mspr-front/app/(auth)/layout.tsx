import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex items-center justify-center h-screen text-white">
      {children}
    </main>
  )
}
