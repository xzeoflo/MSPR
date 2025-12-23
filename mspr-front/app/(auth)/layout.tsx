import "@/styles/globals.css";
import { Rat } from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen w-full">
      <div className="relative hidden lg:block w-1/2 bg-neutral-900 border-r border-stone-700 ">
        <div className="absolute top-8 left-8">

          <span className="text-2xl font-black tracking-tight text-white">
            <Rat size={62} />MSPR
          </span>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </main>
  )
}
