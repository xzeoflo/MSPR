// app/(dashboard)/layout.tsx
import Sidebar from '@/components/ui/layout/Sidebar';
import Footer from '@/components/ui/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-6 md:p-10 mt-4 ml-4">
            {children}
          </div>
          <Footer />
        </main>

      </div>

    </div>
  )
}
