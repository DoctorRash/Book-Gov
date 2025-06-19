"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "citizen" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Verify existing session
    verifySession()
  }, [])

  // Add proper localStorage integration for user management
  const verifySession = async () => {
    try {
      const response = await fetch("/api/auth/verify")
      const data = await response.json()

      if (data.success) {
        setUser(data.user)

        // Store user in localStorage for admin panel access
        if (typeof window !== "undefined") {
          const existingUsers = JSON.parse(localStorage.getItem("appointment_users") || "[]")
          const userExists = existingUsers.find((u: any) => u.id === data.user.id)
          if (!userExists && data.user.role === "citizen") {
            existingUsers.push({
              ...data.user,
              createdAt: new Date().toISOString(),
            })
            localStorage.setItem("appointment_users", JSON.stringify(existingUsers))
          }
        }
      }
    } catch (error) {
      console.error("Session verification failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)

        toast({
          title: data.user.role === "admin" ? "Welcome Admin" : "Welcome back!",
          description: `Successfully logged in as ${data.user.name}.`,
        })

        return true
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.user)

        // Store user in localStorage
        if (typeof window !== "undefined") {
          const existingUsers = JSON.parse(localStorage.getItem("appointment_users") || "[]")
          const newUser = {
            ...result.user,
            createdAt: new Date().toISOString(),
          }
          existingUsers.push(newUser)
          localStorage.setItem("appointment_users", JSON.stringify(existingUsers))
        }

        toast({
          title: "Registration Successful",
          description: `Welcome ${data.name}! Your account has been created.`,
        })

        return true
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Registration failed",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAdmin,
        loading,
      }}
    >
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
