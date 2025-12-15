// app/(dashboard)/layout.tsx
import Sidebar from '@/components/ui/layout/Sidebar';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-6 md:p-10">
            {children}
          </div>
          <Footer />
        </main>

      </div>

    </div>
  )
}
