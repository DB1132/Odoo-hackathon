"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Clock, CalendarCheck, Receipt, UserRound } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageChromeProps {
  title: string
  subtitle?: string
  icon: ReactNode
  children: ReactNode
}

export function PageChrome({ title, subtitle, icon, children }: PageChromeProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = [
    { href: "/employee-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/attendance", label: "Attendance", icon: Clock },
    { href: "/leave-requests", label: "Leave", icon: CalendarCheck },
    { href: "/payroll", label: "Salary", icon: Receipt },
    { href: "/profile", label: "Profile", icon: UserRound },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {icon}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Employee Portal</p>
              <h1 className="text-xl font-semibold text-foreground leading-tight">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.fullName || user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.employeeId}</p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback>{(user?.fullName || "U").charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="border-t" />
        <nav className="flex items-center gap-2 px-4 md:px-6 py-2 overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="shrink-0">
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "gap-2 px-3 py-5 h-10",
                    active && "bg-primary/10 text-primary shadow-sm"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
