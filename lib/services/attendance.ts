import { apiGet, apiPost } from "../api-client";
import { Attendance, CreateAttendance } from "../types";

export const attendanceService = {
  // Get today's attendance
  getTodayAttendance: async (): Promise<Attendance | null> => {
    try {
      return await apiGet<Attendance>("/api/attendance/today");
    } catch {
      return null;
    }
  },

  // Check in
  checkIn: async (): Promise<Attendance> => {
    return apiPost<Attendance>("/api/attendance/check-in", {
      checkIn: new Date().toISOString(),
    });
  },

  // Check out
  checkOut: async (): Promise<Attendance> => {
    return apiPost<Attendance>("/api/attendance/check-out", {
      checkOut: new Date().toISOString(),
    });
  },

  // Get attendance records for current user
  getMyAttendance: async (
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> => {
    let url = `/api/attendance/my-records?page=${page}&limit=${limit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return apiGet(url);
  },

  // Get attendance records for specific employee (admin)
  getEmployeeAttendance: async (
    employeeId: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> => {
    let url = `/api/attendance/${employeeId}?page=${page}&limit=${limit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return apiGet(url);
  },

  // Get all attendance (admin)
  getAllAttendance: async (
    date?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> => {
    let url = `/api/attendance?page=${page}&limit=${limit}`;
    if (date) url += `&date=${date}`;
    return apiGet(url);
  },

  // Get all attendance - alias for compatibility
  getAll: async (page: number = 1, limit: number = 100): Promise<any> => {
    return apiGet(`/api/attendance?page=${page}&limit=${limit}`);
  },

  // Get attendance summary
  getAttendanceSummary: async (month?: string, year?: number): Promise<any> => {
    let url = "/api/attendance/summary";
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return apiGet(url);
  },
};
