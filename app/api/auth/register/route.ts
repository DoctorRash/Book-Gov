import { type NextRequest, NextResponse } from "next/server"
import { signToken } from "@/lib/jwt"
import { sendEmail } from "@/lib/brevo"

const ADMIN_EMAIL = "rasheedahdada@gmail.com"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    // Prevent admin email registration
    if (email === ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: "This email address is reserved" }, { status: 400 })
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: "citizen" as const,
      createdAt: new Date().toISOString(),
    }

    // Generate JWT token
    const token = await signToken(newUser)

    // Send welcome email
    try {
      const emailTemplate = generateWelcomeEmailTemplate(newUser)
      await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        htmlContent: emailTemplate.htmlContent,
      })
    } catch (emailError) {
      console.error("Welcome email failed:", emailError)
      // Don't fail registration if email fails
    }

    const response = NextResponse.json({
      success: true,
      user: newUser,
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
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 })
  }
}

function generateWelcomeEmailTemplate(user: any) {
  return {
    subject: "Welcome to Nigerian Public Service Appointments",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🇳🇬 Welcome to Nigerian Public Service</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Welcome to the Nigerian Public Service Appointment System! Your account has been successfully created.</p>
            <p>You can now book appointments with government ministries and agencies online.</p>
            <p>Thank you for joining us!</p>
          </div>
          <div class="footer">
            <p>Nigerian Public Service Appointment System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}
