"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, PlusCircle } from "lucide-react"
import { leaveService } from "@/lib/services/leave"

export function LeavePage() {
  const { user } = useAuth()
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [leaveType, setLeaveType] = useState<string>("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch user's leave requests on mount
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await leaveService.getMyLeaves()
        const list = Array.isArray((data as any)?.data)
          ? (data as any).data
          : Array.isArray(data)
            ? (data as any)
            : []
        setLeaveRequests(list)
      } catch (error) {
        console.error("Failed to fetch leave requests:", error)
        setLeaveRequests([])
      } finally {
        setLoading(false)
      }
    }
    fetchLeaves()
  }, [])

  const myRequests = leaveRequests.filter((r) => r.user?._id === user?._id || r.employeeId === user?.employeeId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leaveType || !startDate || !endDate) {
      alert("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      const newLeave = await leaveService.createLeave({
        leaveType: leaveType as "Paid" | "Sick" | "Unpaid",
        startDate,
        endDate,
        remarks: reason,
      })
      setLeaveRequests([newLeave, ...leaveRequests])
      setLeaveType("")
      setStartDate("")
      setEndDate("")
      setReason("")
      alert("Leave request submitted successfully!")
    } catch (error) {
      console.error("Failed to submit leave request:", error)
      alert("Failed to submit leave request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const upperStatus = status?.toUpperCase()
    switch (upperStatus) {
      case "APPROVED":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      case "PENDING":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground">Apply for leave and track your requests</p>
        </div>
        <div className="text-center py-8 text-muted-foreground">Loading leave requests...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
        <p className="text-muted-foreground">Apply for leave and track your requests</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {myRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No leave requests found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myRequests.map((request) => (
                <Card key={request._id || request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{request.leaveType || request.type} Leave</Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="font-medium text-foreground">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.remarks || request.reason || "No reason provided"}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Submitted: {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                Apply for Leave
              </CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select value={leaveType} onValueChange={setLeaveType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid Leave</SelectItem>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
