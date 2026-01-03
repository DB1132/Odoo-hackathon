"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, TrendingUp, Play, Square, AlertCircle, CheckCircle, Home, Briefcase } from "lucide-react"
import { attendanceService } from "@/lib/services/attendance"

export function EmployeeDashboard() {
  const { user } = useAuth()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Hydration fix: only set time after mount
  useEffect(() => {
    setIsHydrated(true)
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckInOut = async () => {
    setSubmitting(true)
    try {
      if (!isCheckedIn) {
        // Check in
        await attendanceService.checkIn()
        setCheckInTime(new Date())
        setIsCheckedIn(true)
        alert("Checked in successfully!")
      } else {
        // Check out
        await attendanceService.checkOut()
        setCheckInTime(null)
        setIsCheckedIn(false)
        alert("Checked out successfully!")
      }
    } catch (error) {
      console.error("Failed to record attendance:", error)
      alert("Failed to record attendance. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">{user?.fullName} • {user?.employeeId}</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-4 py-2">
          Role: {user?.role === "ADMIN" ? "Admin" : "Employee"}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Status Today</CardDescription>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{isCheckedIn ? "Active" : "Offline"}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="secondary" 
                className={`text-xs font-normal ${isCheckedIn ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-700'}`}
              >
                {isCheckedIn ? "Checked In" : "Not Checked In"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Attendance</CardDescription>
            <Calendar className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">98%</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "98%" }} />
              </div>
              <span className="text-xs text-muted-foreground">This month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Leave Balance</CardDescription>
            <Briefcase className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground mt-2">Days remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Management - Large Card */}
        <Card className="border-0 shadow-lg ring-1 ring-black/5 lg:col-span-2 xl:col-span-1">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Shift Management
            </CardTitle>
            <CardDescription>Track your work hours</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Time</p>
                <p className="text-6xl font-bold text-foreground font-mono tracking-tighter">
                  {isHydrated ? formatTime(currentTime) : "--:--:--"}
                </p>
              </div>

              {isCheckedIn && checkInTime && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg p-4">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active since {formatTime(checkInTime)}
                  </p>
                </div>
              )}

              <Button
                size="lg"
                className={`w-full h-14 text-lg font-semibold transition-all duration-300 shadow-md ${
                  isCheckedIn 
                    ? "bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02]" 
                    : "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02]"
                }`}
                onClick={handleCheckInOut}
                disabled={submitting}
              >
                {isCheckedIn ? (
                  <>
                    <Square className="w-5 h-5 mr-2 fill-current" />
                    {submitting ? "Checking Out..." : "End Shift (Check Out)"}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    {submitting ? "Checking In..." : "Start Shift (Check In)"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2 xl:col-span-1">
          <Card className="bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-900 dark:text-blue-400">
                <Home className="w-4 h-4" />
                Work Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">Office</p>
              <p className="text-xs text-muted-foreground mt-1">Building A, Floor 3</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-900 dark:text-purple-400">
                <TrendingUp className="w-4 h-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">98%</p>
              <p className="text-xs text-muted-foreground mt-1">On-time adherence</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-900 dark:text-orange-400">
                <AlertCircle className="w-4 h-4" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-orange-700 dark:text-orange-300">Team Meeting Tomorrow</p>
              <p className="text-xs text-muted-foreground mt-1">10:00 AM • Conference Room 302</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}