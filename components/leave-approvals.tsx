"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckSquare, Check, X, Calendar } from "lucide-react"
import { leaveService } from "@/lib/services/leave"

export function LeaveApprovals() {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const data = await leaveService.getAll()
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
    fetchLeaveRequests()
  }, [])

  const safeLeaves = Array.isArray(leaveRequests) ? leaveRequests : []
  const pendingRequests = safeLeaves.filter((r) => r.status === "Pending")
  const processedRequests = safeLeaves.filter((r) => r.status !== "Pending")

  const handleApprove = async (id: string) => {
    try {
      await leaveService.updateStatus(id, "Approved")
      setLeaveRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "Approved" } : r)))
    } catch (error) {
      console.error("Failed to approve leave:", error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await leaveService.updateStatus(id, "Rejected")
      setLeaveRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "Rejected" } : r)))
    } catch (error) {
      console.error("Failed to reject leave:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "Pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>
    }
  }

  const LeaveRequestCard = ({ request, showActions }: { request: any; showActions: boolean }) => {
    return (
      <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarFallback>{(request.employeeName || "E").charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">{request.employeeName || "Employee"}</span>
                {getStatusBadge(request.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {request.startDate ? new Date(request.startDate).toLocaleDateString() : "N/A"} - {request.endDate ? new Date(request.endDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{request.remarks || request.reason || "No reason provided"}</p>
              <p className="text-xs text-muted-foreground">Type: {request.leaveType || "N/A"}</p>
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleApprove(request._id)}
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => handleReject(request._id)}
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave Approvals</h1>
        <p className="text-muted-foreground">Manage employee leave requests</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading leave requests...</div>
      ) : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Requests</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Processed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{processedRequests.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            Pending Requests
          </CardTitle>
          <CardDescription>{pendingRequests.length} requests awaiting action</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No pending requests</div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <LeaveRequestCard key={request._id} request={request} showActions={true} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Processed Requests</CardTitle>
          <CardDescription>Approved or rejected requests</CardDescription>
        </CardHeader>
        <CardContent>
          {processedRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No processed requests</div>
          ) : (
            <div className="space-y-4">
              {processedRequests.map((request) => (
                <LeaveRequestCard key={request._id} request={request} showActions={false} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </>
      )}
    </div>
  )
}
