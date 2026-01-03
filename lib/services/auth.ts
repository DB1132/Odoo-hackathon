import {
  apiPost,
  apiGet,
  apiPut,
  apiDelete,
  apiFetch,
} from "../api-client";
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateEmployeeProfile,
  EmployeeProfile,
} from "../types";

// Authentication Service
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiPost<LoginResponse>("/api/auth/login", credentials);
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("authToken", response.token);
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    return apiPost<LoginResponse>("/api/auth/register", data);
  },

  getCurrentUser: async (): Promise<User> => {
    return apiGet<User>("/api/auth/me");
  },

  verifyEmail: async (token: string): Promise<any> => {
    return apiGet(`/api/auth/verify?token=${token}`);
  },
};

// User Service
export const userService = {
  getUser: async (userId: string): Promise<User> => {
    return apiGet<User>(`/api/users/${userId}`);
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    return apiPut<User>(`/api/users/${userId}`, data);
  },

  getAllUsers: async (page: number = 1, limit: number = 10): Promise<any> => {
    return apiGet(`/api/users?page=${page}&limit=${limit}`);
  },

  deleteUser: async (userId: string): Promise<any> => {
    return apiDelete(`/api/users/${userId}`);
  },
};

// Employee Profile Service
export const employeeService = {
  getProfile: async (userId: string): Promise<EmployeeProfile> => {
    return apiGet<EmployeeProfile>(`/api/employees/profile/${userId}`);
  },

  updateProfile: async (
    userId: string,
    data: UpdateEmployeeProfile
  ): Promise<EmployeeProfile> => {
    return apiPut<EmployeeProfile>(`/api/employees/profile/${userId}`, data);
  },

  getAllEmployees: async (page: number = 1, limit: number = 10): Promise<any> => {
    return apiGet(`/api/employees?page=${page}&limit=${limit}`);
  },

  uploadProfilePicture: async (userId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/employees/profile/${userId}/picture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload profile picture");
    }

    return response.json();
  },
};
