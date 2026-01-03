// User Types
export interface User {
  _id: string;
  employeeId: string;
  email: string;
  password?: string;
  role: "EMPLOYEE" | "ADMIN";
  fullName?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  employeeId: string;
  fullName: string;
  email: string;
  password: string;
  role?: "EMPLOYEE" | "ADMIN";
}

// Salary Types
export interface Salary {
  _id: string;
  basicPay: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  createdAt: string;
  updatedAt: string;
}

// Leave Request Types
export interface LeaveRequest {
  _id: string;
  user: string; // User ID
  leaveType: "Paid" | "Sick" | "Unpaid";
  startDate: string;
  endDate: string;
  remarks?: string;
  status: "Pending" | "Approved" | "Rejected";
  reviewedBy?: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveRequest {
  leaveType: "Paid" | "Sick" | "Unpaid";
  startDate: string;
  endDate: string;
  remarks?: string;
}

// Employee Profile Types
export interface EmployeeProfile {
  _id: string;
  user: string; // User ID
  fullName: string;
  phone?: string;
  address?: string;
  jobTitle?: string;
  department?: string;
  profilePicture?: string;
  salary?: string; // Salary ID
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmployeeProfile {
  fullName?: string;
  phone?: string;
  address?: string;
  jobTitle?: string;
  department?: string;
  profilePicture?: string;
}

// Attendance Types
export interface Attendance {
  _id: string;
  user: string; // User ID
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "Present" | "Absent" | "Late";
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendance {
  checkIn: string;
  checkOut?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
