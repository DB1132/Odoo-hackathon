import { apiGet, apiPost, apiPut } from "../api-client";
import { Salary } from "../types";

export const salaryService = {
  // Get current user's salary info
  getMySalary: async (): Promise<Salary> => {
    return apiGet<Salary>("/api/salary/my-salary");
  },

  // Get salary for specific employee (admin)
  getEmployeeSalary: async (employeeId: string): Promise<Salary> => {
    return apiGet<Salary>(`/api/salary/${employeeId}`);
  },

  // Get all salaries (admin) - alias for compatibility
  getAll: async (page: number = 1, limit: number = 100): Promise<any> => {
    return apiGet(`/api/salary?page=${page}&limit=${limit}`);
  },

  // Get all salaries (admin)
  getAllSalaries: async (page: number = 1, limit: number = 10): Promise<any> => {
    return apiGet(`/api/salary?page=${page}&limit=${limit}`);
  },

  // Update salary (admin)
  updateSalary: async (employeeId: string, data: Partial<Salary>): Promise<Salary> => {
    return apiPut<Salary>(`/api/salary/${employeeId}`, data);
  },

  // Get payslips for current user
  getMyPayslips: async (month?: string, year?: number): Promise<any> => {
    let url = "/api/salary/payslips/my-payslips";
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return apiGet(url);
  },

  // Get payslips for specific employee (admin)
  getEmployeePayslips: async (
    employeeId: string,
    month?: string,
    year?: number
  ): Promise<any> => {
    let url = `/api/salary/payslips/${employeeId}`;
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year.toString());
    if (params.toString()) url += `?${params.toString()}`;
    return apiGet(url);
  },

  // Generate payslip
  generatePayslip: async (employeeId: string, month: string, year: number): Promise<any> => {
    return apiPost("/api/salary/payslips/generate", {
      employeeId,
      month,
      year,
    });
  },
};
