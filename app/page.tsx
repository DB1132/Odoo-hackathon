"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useEffect } from "react"

function AppContent() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.push("/admin-dashboard")
      } else {
        router.push("/employee-dashboard")
      }
    }
  }, [isAuthenticated, loading, user, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return isAuthenticated ? <DashboardLayout /> : <LoginPage />
}

export default function Home() {
  return <AppContent />
}
