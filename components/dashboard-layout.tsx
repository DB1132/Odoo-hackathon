"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { EmployeeDashboard } from "./employee-dashboard"
import { AdminDashboard } from "./admin-dashboard"
import { AttendancePage } from "./attendance-page"
import { LeavePage } from "./leave-page"
import { ProfilePage } from "./profile-page"
import { PayslipsPage } from "./payslips-page"
import { EmployeeDirectory } from "./employee-directory"
import { LeaveApprovals } from "./leave-approvals"
import { PayrollManagement } from "./payroll-management"
import { useAuth } from "@/lib/auth-context"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileMenuOpen])

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />
      case "attendance":
        return <AttendancePage />
      case "leave":
        return <LeavePage />
      case "profile":
        return <ProfilePage />
      case "payslips":
        return <PayslipsPage />
      case "directory":
        return <EmployeeDirectory />
      case "approvals":
        return <LeaveApprovals />
      case "payroll":
        return <PayrollManagement />
      default:
        return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background w-full">
      {/* 1. Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:flex flex-shrink-0">
        <AppSidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* 2. Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative w-3/4 max-w-xs h-full bg-background animate-in slide-in-from-left duration-300 shadow-xl">
            <AppSidebar
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              collapsed={false}
              onToggleCollapse={() => {}}
              isMobile={true}
              onMobileClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header Bar (Only visible on small screens) */}
        <div className="md:hidden flex items-center p-4 border-b bg-card">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="ml-3 font-semibold text-lg">Dayflow</span>
        </div>

        {/* Existing AppHeader (Hidden on mobile if it duplicates content, or kept) */}
        <div className="hidden md:block">
            <AppHeader onNavigate={setCurrentPage} />
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
            {renderPage()}
        </main>
      </div>
    </div>
  )
}