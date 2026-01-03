"use client"

import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Clock,
  Calendar,
  User,
  Receipt,
  Users,
  CheckSquare,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  isMobile?: boolean
  onMobileClose?: () => void
}

export function AppSidebar({ 
  currentPage, 
  onNavigate, 
  collapsed, 
  onToggleCollapse,
  isMobile = false,
  onMobileClose
}: AppSidebarProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const commonLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave", icon: Calendar },
  ]

  const employeeLinks = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "payslips", label: "My Payslips", icon: Receipt },
  ]

  const adminLinks = [
    { id: "directory", label: "Employee Directory", icon: Users },
    { id: "approvals", label: "Leave Approvals", icon: CheckSquare },
    { id: "payroll", label: "Payroll Management", icon: DollarSign },
  ]

  const links = isAdmin ? [...commonLinks, ...adminLinks] : [...commonLinks, ...employeeLinks]

  const handleNavigation = (pageId: string) => {
    onNavigate(pageId)
    if (isMobile && onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 h-full",
        isMobile ? "w-full shadow-none" : collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      {/* Logo Area */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-sidebar-border/50",
          collapsed && !isMobile ? "justify-center" : "justify-between px-6",
        )}
      >
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Dayflow</span>
          </div>
        )}
        
        {/* Mobile Close Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMobileClose} className="h-8 w-8 ml-auto">
            <X className="w-5 h-5" />
          </Button>
        )}

        {/* Collapsed Logo (Desktop Only) */}
        {collapsed && !isMobile && (
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Clock className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <Button
            key={link.id}
            variant={currentPage === link.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 transition-all duration-200",
              collapsed && !isMobile ? "justify-center px-0" : "px-4",
              currentPage === link.id 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
            onClick={() => handleNavigation(link.id)}
            title={collapsed ? link.label : undefined}
          >
            <link.icon className={cn("w-5 h-5 shrink-0", currentPage === link.id && "text-primary")} />
            {(!collapsed || isMobile) && <span>{link.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Desktop Collapse Toggle */}
      {!isMobile && (
        <div className="p-4 border-t border-sidebar-border/50">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("w-full hover:bg-sidebar-accent", collapsed && "justify-center px-0")} 
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-sidebar-foreground/70" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 mr-2 text-sidebar-foreground/70" />
                <span className="text-sidebar-foreground/70">Collapse Sidebar</span>
              </>
            )}
          </Button>
        </div>
      )}
    </aside>
  )
}