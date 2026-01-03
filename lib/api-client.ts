// API configuration and axios instance setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Generic fetch wrapper
export const apiFetch = async <T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const url = getApiUrl(endpoint);
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// Convenience methods
export const apiGet = <T = any>(endpoint: string) =>
  apiFetch<T>(endpoint, { method: "GET" });

export const apiPost = <T = any>(endpoint: string, data: any) =>
  apiFetch<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const apiPut = <T = any>(endpoint: string, data: any) =>
  apiFetch<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const apiDelete = <T = any>(endpoint: string) =>
  apiFetch<T>(endpoint, { method: "DELETE" });

export const apiPatch = <T = any>(endpoint: string, data: any) =>
  apiFetch<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
