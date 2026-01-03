"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserCheck, Clock, AlertCircle, Download, Plus, Search } from "lucide-react"
import { attendanceService } from "@/lib/services/attendance"
import { leaveService } from "@/lib/services/leave"

const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "--:--"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "--:--"
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  } catch {
    return "--:--"
  }
}

export function AdminDashboard() {
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [leaveData, setLeaveData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendance, leaves] = await Promise.all([
          attendanceService.getAll(),
          leaveService.getAll()
        ])
        
        const attendanceList = Array.isArray((attendance as any)?.data)
          ? (attendance as any).data
          : Array.isArray(attendance)
            ? (attendance as any)
            : []
        
        const leaveList = Array.isArray((leaves as any)?.data)
          ? (leaves as any).data
          : Array.isArray(leaves)
            ? (leaves as any)
            : []
        
        setAttendanceData(attendanceList)
        setLeaveData(leaveList)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get today's date for filtering
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filter records for today
  const todayAttendance = attendanceData.filter((r) => {
    const recordDate = new Date(r.date)
    recordDate.setHours(0, 0, 0, 0)
    return recordDate.getTime() === today.getTime()
  })

  const presentToday = todayAttendance.filter((r) => r.status === "Present").length
  const pendingLeaves = leaveData.filter((r) => r.status === "Pending").length
  const recentActivity = todayAttendance.slice(0, 5)

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Executive Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time organization metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Total Employees</CardDescription>
            <Users className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{attendanceData.length > 0 ? new Set(attendanceData.map(r => r.user?._id)).size : 0}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs font-normal">Active</Badge>
              <span className="text-xs text-muted-foreground">in system</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Present Today</CardDescription>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{presentToday}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${todayAttendance.length > 0 ? (presentToday / todayAttendance.length) * 100 : 0}%` }} 
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 0}% rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Action Items</CardDescription>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{pendingLeaves}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Leave requests pending approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                Live Attendance Feed
              </CardTitle>
              <CardDescription>Real-time check-in updates</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="py-4 px-6 font-medium">Employee</th>
                  <th className="py-4 px-6 font-medium">Check In</th>
                  <th className="py-4 px-6 font-medium">Check Out</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {!loading && recentActivity.length > 0 ? (
                  recentActivity.map((record) => (
                    <tr key={record._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 border-2 border-background">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {(record.employeeName || "E").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{record.employeeName || "Employee"}</p>
                            <p className="text-xs text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-muted-foreground">
                        {formatTime(record.checkIn)}
                      </td>
                      <td className="py-4 px-6 font-mono text-muted-foreground">
                        {formatTime(record.checkOut)}
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`rounded-full px-3 py-1 border-0 ${
                            record.status === "Present"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : record.status === "Half-day"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                          }`}
                        >
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      {loading ? "Loading attendance data..." : "No activity recorded today"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}