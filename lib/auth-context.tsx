"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "./services"

export type UserRole = "ADMIN" | "EMPLOYEE"

interface User {
  _id: string
  employeeId: string
  email: string
  role: UserRole
  fullName?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (employeeId: string, fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("authToken")
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("authToken", response.token)
    } catch (error) {
      throw error
    }
  }

  const register = async (employeeId: string, fullName: string, email: string, password: string) => {
    try {
      const response = await authService.register({ employeeId, fullName, email, password })
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("authToken", response.token)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    authService.logout()
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
