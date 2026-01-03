"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Search, Download, Send } from "lucide-react"
import { salaryService } from "@/lib/services/salary"

export function PayrollManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("january-2024")
  const [payrollData, setPayrollData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const data = await salaryService.getAll()
        const list = Array.isArray((data as any)?.data)
          ? (data as any).data
          : Array.isArray(data)
            ? (data as any)
            : []
        setPayrollData(list)
      } catch (error) {
        console.error("Failed to fetch payroll data:", error)
        setPayrollData([])
      } finally {
        setLoading(false)
      }
    }
    fetchPayroll()
  }, [])

  const safePayroll = Array.isArray(payrollData) ? payrollData : []
  const filteredPayroll = safePayroll.filter(
    (emp) =>
      (emp.fullName || emp.user?.employeeId || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPayroll = filteredPayroll.reduce((acc, emp) => {
    const base = emp.baseSalary ?? emp.basicPay ?? 0
    const bonus = emp.bonus ?? emp.allowances ?? 0
    const ded = emp.deductions ?? 0
    return acc + base + bonus - ded
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payroll Management</h1>
        <p className="text-muted-foreground">Manage employee salaries and payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Payroll</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              ${totalPayroll.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Current Period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Employees</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{filteredPayroll.length}</p>
            <p className="text-sm text-muted-foreground">Active payroll entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-sm text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading payroll data...</div>
      ) : (
      <>
      {/* Payroll Details */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Payroll Details
              </CardTitle>
              <CardDescription>Employee salary information</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredPayroll.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No payroll data found</div>
            ) : (
            filteredPayroll.map((emp) => (
              <div
                key={emp._id}
                className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{(emp.fullName || "E").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">{emp.fullName || emp.user?.employeeId || "Employee"}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Base Salary:</span>
                        <span className="font-semibold text-foreground">${(emp.baseSalary ?? emp.basicPay ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Bonus:</span>
                        <span className="font-semibold text-foreground">${(emp.bonus ?? emp.allowances ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Deductions:</span>
                        <span className="font-semibold text-foreground">-${(emp.deductions || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="border-t border-border my-2"></div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Net Pay:</span>
                        <span className="font-bold text-primary">${((emp.baseSalary ?? emp.basicPay ?? 0) + (emp.bonus ?? emp.allowances ?? 0) - (emp.deductions || 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  )
}
