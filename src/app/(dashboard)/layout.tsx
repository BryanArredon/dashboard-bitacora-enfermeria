import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#020617]">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />
      
      {/* Contenedor principal derecho */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar />
        
        {/* Decorative Blur Backgrounds for the Data Area */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
