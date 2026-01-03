import { apiGet, apiPost, apiPut, apiDelete } from "../api-client";
import { EmployeeProfile } from "../types";

export const employeeService = {
  // Get current user's profile
  getMyProfile: async (): Promise<EmployeeProfile> => {
    return apiGet<EmployeeProfile>("/api/employees/me");
  },

  // Get all employees (admin)
  getAll: async (page: number = 1, limit: number = 100): Promise<any> => {
    return apiGet(`/api/employees?page=${page}&limit=${limit}`);
  },

  // Get single employee
  getById: async (employeeId: string): Promise<EmployeeProfile> => {
    return apiGet<EmployeeProfile>(`/api/employees/${employeeId}`);
  },

  // Update employee profile
  updateProfile: async (data: Partial<EmployeeProfile>): Promise<EmployeeProfile> => {
    return apiPut<EmployeeProfile>("/api/employees/me", data);
  },

  // Update employee by admin
  updateEmployee: async (employeeId: string, data: Partial<EmployeeProfile>): Promise<EmployeeProfile> => {
    return apiPut<EmployeeProfile>(`/api/employees/${employeeId}`, data);
  },

  // Delete employee (admin)
  delete: async (employeeId: string): Promise<any> => {
    return apiDelete(`/api/employees/${employeeId}`);
  },
};
