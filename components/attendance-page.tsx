"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Search } from "lucide-react"
import { attendanceService } from "@/lib/services/attendance"

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleDateString()
  } catch {
    return "-"
  }
}

const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "--:--"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "--:--"
    return date.toLocaleTimeString()
  } catch {
    return "--:--"
  }
}

export function AttendancePage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN"
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        let data
        if (isAdmin) {
          data = await attendanceService.getAll()
        } else {
          data = await attendanceService.getMyAttendance()
        }
        
        const list = Array.isArray((data as any)?.data)
          ? (data as any).data
          : Array.isArray(data)
            ? (data as any)
            : []
        setAttendanceRecords(list)
      } catch (error) {
        console.error("Failed to fetch attendance:", error)
        setAttendanceRecords([])
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [isAdmin])

  const filteredRecords = attendanceRecords.filter((record) => {
    // For employees, only show their own records
    if (!isAdmin && record.user?.employeeId !== user?.employeeId) {
      return false
    }

    // Search filter
    const employeeName = record.employeeName || record.user?.employeeId || ""
    if (searchTerm && !employeeName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && record.status !== statusFilter) {
      return false
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-success text-success-foreground">Present</Badge>
      case "Absent":
        return <Badge variant="destructive">Absent</Badge>
      case "Half-day":
        return <Badge className="bg-warning text-warning-foreground">Half-day</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">
          {isAdmin ? "View all employee attendance records" : "View your attendance history"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading attendance records...</div>
      ) : (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Attendance Records
          </CardTitle>
          <CardDescription>
            {isAdmin ? "Filter and search employee attendance" : "Your attendance history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters - Admin only */}
          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {isAdmin && <th className="text-left py-3 px-4 font-medium text-muted-foreground">Employee</th>}
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Check In</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Check Out</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record._id || record.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      {isAdmin && (
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{(record.employeeName || "E").charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{record.employeeName || record.user?.employeeId || "Employee"}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-3 px-4 text-foreground">{formatDate(record.date)}</td>
                      <td className="py-3 px-4 text-foreground">{formatTime(record.checkIn)}</td>
                      <td className="py-3 px-4 text-foreground">{formatTime(record.checkOut)}</td>
                      <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="py-8 text-center text-muted-foreground">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  )
}
