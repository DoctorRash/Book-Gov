import { type NextRequest, NextResponse } from "next/server"
import { signToken } from "@/lib/jwt"

// Fixed admin credentials
const ADMIN_EMAIL = "rasheedahdada@gmail.com"
const ADMIN_PASSWORD = "bami@1234"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Check for admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: "admin",
        name: "System Administrator",
        email: ADMIN_EMAIL,
        phone: "+234-800-ADMIN",
        role: "admin",
      }

      const token = await signToken(adminUser)

      const response = NextResponse.json({
        success: true,
        user: adminUser,
        token,
      })

      // Set HTTP-only cookie
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
      })

      return response
    }

    // For demo purposes, simulate checking users from localStorage
    // In production, this would query a database
    const foundUser = {
      id: Date.now().toString(),
      name: "Demo User",
      email: email,
      phone: "+234-XXX-XXXX",
      role: "citizen" as const,
    }

    const token = await signToken(foundUser)

    const response = NextResponse.json({
      success: true,
      user: foundUser,
      token,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
