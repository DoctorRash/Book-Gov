import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/brevo"

export async function POST(request: NextRequest) {
  try {
    const { to, type } = await request.json()

    const emailTemplate = {
      subject: "🧪 Test Email - Nigerian Public Service",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Test Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .success { background: #dcfce7; border: 1px solid #22c55e; padding: 15px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🇳🇬 Nigerian Public Service</h1>
              <h2>Email System Test</h2>
            </div>
            
            <div class="content">
              <div class="success">
                <h3>✅ Email System Working!</h3>
                <p>This is a test email to verify that the email notification system is functioning correctly.</p>
              </div>
              
              <h3>📋 Test Details</h3>
              <ul>
                <li><strong>Test Type:</strong> ${type}</li>
                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Recipient:</strong> ${to}</li>
                <li><strong>System:</strong> Nigerian Public Service Appointment System</li>
              </ul>
              
              <h3>🔧 What This Confirms</h3>
              <ul>
                <li>Email delivery system is operational</li>
                <li>Templates are rendering correctly</li>
                <li>SMTP configuration is working</li>
                <li>Brevo integration is functional</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Nigerian Public Service Appointment System</p>
              <p>This is an automated test message</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const result = await sendEmail({
      to,
      subject: emailTemplate.subject,
      htmlContent: emailTemplate.htmlContent,
    })

    return NextResponse.json({
      success: true,
      result,
      message: "Test email sent successfully",
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
      },
      { status: 500 },
    )
  }
}
