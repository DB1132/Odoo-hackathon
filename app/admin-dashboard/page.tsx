"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (user.role !== "ADMIN") {
        router.push("/employee-dashboard");
      }
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dayflow - Admin</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6 py-3">
            <Link href="/admin-dashboard" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-3">
              Dashboard
            </Link>
            <Link href="/admin/employees" className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-3">
              Employees
            </Link>
            <Link href="/admin/leave-approvals" className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-3">
              Leave Approvals
            </Link>
            <Link href="/admin/payroll" className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-3">
              Payroll
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </div>
    </div>
  );
}
