import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, generateAppointmentEmailTemplate, generateAdminNotificationTemplate } from "@/lib/brevo"

export async function POST(request: NextRequest) {
  try {
    const { type, appointment, user } = await request.json()

    const notification = {
      id: `${type}_${Date.now()}`,
      type,
      title: "",
      message: "",
      timestamp: new Date().toISOString(),
      read: false,
    }

    switch (type) {
      case "new_appointment":
        notification.title = "New Appointment Booked"
        notification.message = `${user.name} booked an appointment for ${appointment.serviceName} at ${appointment.ministryName}`
        break
      case "user_registration":
        notification.title = "New User Registered"
        notification.message = `${user.name} has registered on the platform`
        break
      default:
        notification.title = "New Notification"
        notification.message = "A new event has occurred"
    }

    // Save notification to localStorage for admin panel
    console.log("📧 Saving admin notification:", notification)

    // Send email notifications
    if (type === "new_appointment") {
      try {
        // Send confirmation email to citizen
        const citizenEmailTemplate = generateAppointmentEmailTemplate(appointment, user)
        await sendEmail({
          to: user.email,
          subject: citizenEmailTemplate.subject,
          htmlContent: citizenEmailTemplate.htmlContent,
        })

        // Send notification email to admin
        const adminEmailTemplate = generateAdminNotificationTemplate(appointment, user)
        await sendEmail({
          to: "rasheedahdada@gmail.com",
          subject: adminEmailTemplate.subject,
          htmlContent: adminEmailTemplate.htmlContent,
        })

        console.log("📧 Both citizen and admin emails sent successfully")
      } catch (emailError) {
        console.error("❌ Error sending emails:", emailError)
      }
    }

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error("Error in notify-admin:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
