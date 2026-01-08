import { AppSidebar } from "@/components/ui/layout/app-sidebar";
import Footer from "@/components/ui/layout/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-y-auto">
          <SidebarTrigger />
          <div className="flex-1 p-6 md:p-10">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
          <footer className="border-t border-border/40">
            <Footer />
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}
