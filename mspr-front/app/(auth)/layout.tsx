import "@/styles/globals.css";
import { Rat } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between bg-sidebar border-r border-sidebar-border p-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 border-b-3 border-primary">
            <div className="flex h-12 w-12 items-center justify-center">
              <Rat size={32} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground pr-4">
              MSPR
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-sm max-w-sm text-foreground">
            Plateforme sécurisée de gestion et analyse de données.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-8 lg:w-1/2 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}
