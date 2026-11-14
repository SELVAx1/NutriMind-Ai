import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Header } from './Header'

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface-0">
      <Sidebar />
      <MobileNav />
      <main className="app-main">
        <Header />
        <div className="page-container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
