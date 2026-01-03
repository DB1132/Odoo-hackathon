import { apiGet, apiPost, apiPut, apiDelete } from "../api-client";
import { LeaveRequest, CreateLeaveRequest } from "../types";

export const leaveService = {
  // Get all leave requests for current user
  getMyLeaves: async (page: number = 1, limit: number = 10): Promise<any> => {
    return apiGet(`/api/leaves/my-requests?page=${page}&limit=${limit}`);
  },

  // Get all leave requests (admin) - alias for compatibility
  getAll: async (page: number = 1, limit: number = 100): Promise<any> => {
    return apiGet(`/api/leaves?page=${page}&limit=${limit}`);
  },

  // Get all leave requests (admin)
  getAllLeaves: async (page: number = 1, limit: number = 10): Promise<any> => {
    return apiGet(`/api/leaves?page=${page}&limit=${limit}`);
  },

  // Get single leave request
  getLeave: async (leaveId: string): Promise<LeaveRequest> => {
    return apiGet<LeaveRequest>(`/api/leaves/${leaveId}`);
  },

  // Create new leave request
  createLeave: async (data: CreateLeaveRequest): Promise<LeaveRequest> => {
    return apiPost<LeaveRequest>("/api/leaves", data);
  },

  // Update leave request
  updateLeave: async (
    leaveId: string,
    data: Partial<CreateLeaveRequest>
  ): Promise<LeaveRequest> => {
    return apiPut<LeaveRequest>(`/api/leaves/${leaveId}`, data);
  },

  // Delete leave request
  deleteLeave: async (leaveId: string): Promise<any> => {
    return apiDelete(`/api/leaves/${leaveId}`);
  },

  // Approve leave (admin)
  approveLeave: async (leaveId: string): Promise<LeaveRequest> => {
    return apiPut<LeaveRequest>(`/api/leaves/${leaveId}/approve`, {});
  },

  // Reject leave (admin)
  rejectLeave: async (leaveId: string): Promise<LeaveRequest> => {
    return apiPut<LeaveRequest>(`/api/leaves/${leaveId}/reject`, {});
  },

  // Update leave status (admin) - new method for compatibility
  updateStatus: async (leaveId: string, status: string): Promise<LeaveRequest> => {
    if (status === "Approved") {
      return leaveService.approveLeave(leaveId);
    } else if (status === "Rejected") {
      return leaveService.rejectLeave(leaveId);
    }
    return apiPut<LeaveRequest>(`/api/leaves/${leaveId}`, { status });
  },

  // Get leave balance
  getLeaveBalance: async (userId: string): Promise<any> => {
    return apiGet(`/api/leaves/balance/${userId}`);
  },
};
