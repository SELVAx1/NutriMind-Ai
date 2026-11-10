import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Header } from './Header'

export function AppShell() {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <MobileNav />
      <main className="app-main">
        <div className="px-6 lg:px-10 xl:px-12 max-w-[1400px]">
          <Header />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
