import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="desktop-wrapper">
      <div className="desktop-app-container">
        {/* Desktop Sidebar (Left Column) */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main Content Area (Right Column) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FCFDFD]">
          <Header onToggleMobileMenu={() => setMobileNavOpen(true)} />
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
