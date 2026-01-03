export interface Employee {
  id: string
  name: string
  role: "admin" | "employee" | "manager" // <--- This fixes the red line
  department: string
  avatar?: string
  status: "Active" | "Inactive"
  email: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: "Present" | "Absent" | "Half-day" | "Late"
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: "Sick" | "Casual" | "Vacation"
  startDate: string
  endDate: string
  status: "Pending" | "Approved" | "Rejected"
  reason: string
}

// Mock Data
export const employees: Employee[] = [
  {
    id: "EMP001",
    name: "Sarah Johnson",
    role: "admin",
    department: "HR",
    status: "Active",
    email: "sarah@dayflow.com",
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "EMP002",
    name: "Michael Chen",
    role: "manager",
    department: "Engineering",
    status: "Active",
    email: "michael@dayflow.com"
  },
  {
    id: "EMP003",
    name: "Jessica Davis",
    role: "employee",
    department: "Marketing",
    status: "Active",
    email: "jessica@dayflow.com"
  },
  {
    id: "EMP004",
    name: "David Wilson",
    role: "employee",
    department: "Engineering",
    status: "Active",
    email: "david@dayflow.com"
  },
  {
    id: "EMP005",
    name: "Emily Brown",
    role: "employee",
    department: "Design",
    status: "Active",
    email: "emily@dayflow.com"
  }
]

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    employeeName: "Sarah Johnson",
    date: "2024-01-15",
    checkIn: "08:55 AM",
    checkOut: "05:05 PM",
    status: "Present"
  },
  {
    id: "ATT002",
    employeeId: "EMP002",
    employeeName: "Michael Chen",
    date: "2024-01-15",
    checkIn: "09:10 AM",
    checkOut: "06:00 PM",
    status: "Present"
  },
  {
    id: "ATT003",
    employeeId: "EMP003",
    employeeName: "Jessica Davis",
    date: "2024-01-15",
    checkIn: "09:00 AM",
    checkOut: "01:00 PM",
    status: "Half-day"
  },
  {
    id: "ATT004",
    employeeId: "EMP004",
    employeeName: "David Wilson",
    date: "2024-01-15",
    checkIn: "--:--",
    checkOut: "--:--",
    status: "Absent"
  },
  {
    id: "ATT005",
    employeeId: "EMP005",
    employeeName: "Emily Brown",
    date: "2024-01-15",
    checkIn: "09:30 AM",
    checkOut: "06:30 PM",
    status: "Present"
  }
]

export const leaveRequests: LeaveRequest[] = [
  {
    id: "LR001",
    employeeId: "EMP003",
    employeeName: "Jessica Davis",
    type: "Sick",
    startDate: "2024-01-20",
    endDate: "2024-01-21",
    status: "Pending",
    reason: "Viral fever"
  },
  {
    id: "LR002",
    employeeId: "EMP004",
    employeeName: "David Wilson",
    type: "Vacation",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    status: "Pending",
    reason: "Family trip"
  }
]