"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, Phone } from "lucide-react"
import { employeeService } from "@/lib/services/employee"

export function EmployeeDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAll()
        const list = Array.isArray((data as any)?.data)
          ? (data as any).data
          : Array.isArray(data)
            ? (data as any)
            : []
        setEmployees(list)
      } catch (error) {
        console.error("Failed to fetch employees:", error)
        setEmployees([])
      } finally {
        setLoading(false)
      }
    }
    fetchEmployees()
  }, [])

  const safeEmployees = Array.isArray(employees) ? employees : []
  const filteredEmployees = safeEmployees.filter(
    (employee) =>
      (employee.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Employee Directory</h1>
        <p className="text-muted-foreground">Browse and search all employees</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            All Employees
          </CardTitle>
          <CardDescription>{employees.length} team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, department, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No employees found</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee._id}
                className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{(employee.fullName || "E").charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{employee.fullName || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">{employee.jobTitle || "N/A"}</div>
                    <div className="text-xs text-muted-foreground mt-1">{employee.department || "N/A"}</div>
                    <div className="flex gap-3 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{employee.email || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
