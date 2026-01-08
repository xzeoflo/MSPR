import { AppSidebar } from "@/components/ui/layout/app-sidebar";
import Footer from "@/components/ui/layout/Footer";
import Header from "@/components/ui/layout/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <main className="flex flex-1 flex-col min-w-0">
          <Header />
          <div className="flex items-center px-4 py-2">
            <SidebarTrigger />
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
          </div>
          <footer className="border-t border-border/40">
            <Footer />
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}
