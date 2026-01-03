"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { attendanceService, leaveService } from "@/lib/services";
import { Attendance, LeaveRequest } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { PageChrome } from "@/components/page-chrome";
import { LayoutDashboard, UserRound, Clock, CalendarCheck, Receipt } from "lucide-react";

export default function EmployeeDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const attendanceData = await attendanceService.getTodayAttendance();
        setTodayAttendance(attendanceData);

        const leavesData = await leaveService.getMyLeaves(1, 5);
        setPendingLeaves(leavesData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn();
      const attendance = await attendanceService.getTodayAttendance();
      setTodayAttendance(attendance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check in");
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut();
      const attendance = await attendanceService.getTodayAttendance();
      setTodayAttendance(attendance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check out");
    }
  };

  if (loading || authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <PageChrome title="Dashboard" subtitle="Your daily overview" icon={<LayoutDashboard className="w-5 h-5" />}>
      {error && (
        <Card className="bg-red-50 border-red-200 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/profile">
          <Card className="p-6 hover:shadow-lg cursor-pointer transition">
            <div className="flex items-center gap-3 mb-2 text-foreground">
              <UserRound className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Profile</h3>
            </div>
            <p className="text-sm text-muted-foreground">View & Edit Profile</p>
          </Card>
        </Link>

        <Link href="/attendance">
          <Card className="p-6 hover:shadow-lg cursor-pointer transition">
            <div className="flex items-center gap-3 mb-2 text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Attendance</h3>
            </div>
            <p className="text-sm text-muted-foreground">View Attendance Records</p>
          </Card>
        </Link>

        <Link href="/leave-requests">
          <Card className="p-6 hover:shadow-lg cursor-pointer transition">
            <div className="flex items-center gap-3 mb-2 text-foreground">
              <CalendarCheck className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Leave Requests</h3>
            </div>
            <p className="text-sm text-muted-foreground">Apply for Leave</p>
          </Card>
        </Link>

        <Link href="/payroll">
          <Card className="p-6 hover:shadow-lg cursor-pointer transition">
            <div className="flex items-center gap-3 mb-2 text-foreground">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Salary</h3>
            </div>
            <p className="text-sm text-muted-foreground">View Payroll Details</p>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Today's Attendance</h2>
          {todayAttendance ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in Time</p>
                  <p className="text-lg font-semibold text-foreground">{todayAttendance.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out Time</p>
                  <p className="text-lg font-semibold text-foreground">
                    {todayAttendance.checkOut || "Not checked out"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                {!todayAttendance.checkOut && (
                  <Button onClick={handleCheckOut} className="flex-1">
                    Check Out
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => router.push("/attendance")}>
                  View Details
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">You haven't checked in today</p>
              <Button onClick={handleCheckIn}>Check In Now</Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Pending Leaves</h2>
          {pendingLeaves.length > 0 ? (
            <div className="space-y-3">
              {pendingLeaves.map((leave) => (
                <Card key={leave._id} className="p-3 bg-muted/40 border-dashed">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">{leave.leaveType}</p>
                      <p className="text-sm text-muted-foreground">{leave.status}</p>
                    </div>
                    <Badge>{leave.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No pending leave requests</p>
          )}
          <Button variant="link" className="mt-4 p-0" onClick={() => router.push("/leave-requests")}>
            View All
          </Button>
        </Card>
      </div>
    </PageChrome>
  );
}
