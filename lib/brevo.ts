interface EmailData {
  to: string
  subject: string
  htmlContent: string
  textContent?: string
}

export async function sendEmail({ to, subject, htmlContent, textContent }: EmailData) {
  try {
    console.log("📧 Attempting to send email to:", to)

    // In production, use actual Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "your-brevo-api-key",
      },
      body: JSON.stringify({
        sender: {
          name: "Nigerian Public Service",
          email: "noreply@nigerianappointments.gov.ng",
        },
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent: textContent || htmlContent.replace(/<[^>]*>/g, ""),
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("❌ Brevo API error:", response.status, errorData)
      throw new Error(`Brevo API error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()
    console.log("✅ Email sent successfully via Brevo:", {
      to,
      subject,
      messageId: result.messageId,
      timestamp: new Date().toISOString(),
    })
    return { success: true, messageId: result.messageId, provider: "brevo" }
  } catch (error) {
    console.error("❌ Brevo email error:", error)

    // Enhanced fallback logging for development/testing
    const emailLog = {
      timestamp: new Date().toISOString(),
      to,
      subject,
      status: "fallback_logged",
      htmlPreview: htmlContent.substring(0, 200) + "...",
      error: error instanceof Error ? error.message : "Unknown error",
    }

    console.log("📧 Email (Development/Fallback Mode):", emailLog)

    // Store email logs in localStorage for testing
    if (typeof window !== "undefined") {
      const emailLogs = JSON.parse(localStorage.getItem("email_logs") || "[]")
      emailLogs.push(emailLog)
      localStorage.setItem("email_logs", JSON.stringify(emailLogs))
    }

    return { success: true, fallback: true, log: emailLog }
  }
}

export function generateAppointmentEmailTemplate(appointment: any, user: any) {
  return {
    subject: `Appointment Confirmation - ${appointment.ministryName}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .appointment-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🇳🇬 Nigerian Public Service</h1>
            <h2>Appointment Confirmation</h2>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <p>Your appointment has been successfully booked! Here are your appointment details:</p>
            
            <div class="appointment-details">
              <h3>📋 Appointment Details</h3>
              <p><strong>Appointment ID:</strong> ${appointment.id}</p>
              <p><strong>Queue Number:</strong> ${appointment.queueNumber}</p>
              <p><strong>Ministry:</strong> ${appointment.ministryName}</p>
              <p><strong>Service:</strong> ${appointment.serviceName}</p>
              <p><strong>Location:</strong> ${appointment.location}, ${appointment.state}</p>
              <p><strong>Date:</strong> ${appointment.date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Status:</strong> Pending Confirmation</p>
            </div>
            
            <div class="appointment-details">
              <h3>📝 Important Instructions</h3>
              <ul>
                <li>Arrive 15 minutes before your scheduled time</li>
                <li>Bring all required documents</li>
                <li>Bring a valid form of identification</li>
                <li>Your queue number is: <strong>${appointment.queueNumber}</strong></li>
              </ul>
            </div>
            
            <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>
            
            <p>Thank you for using the Nigerian Public Service Appointment System!</p>
          </div>
          
          <div class="footer">
            <p>Nigerian Public Service Appointment System</p>
            <p>Federal Capital Territory, Abuja</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

export function generateAdminNotificationTemplate(appointment: any, user: any) {
  return {
    subject: `New Appointment Booked - ${appointment.ministryName}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Appointment Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .urgent { background: #fef2f2; border-left: 4px solid #dc2626; padding: 10px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Admin Alert</h1>
            <h2>New Appointment Booked</h2>
          </div>
          
          <div class="content">
            <div class="urgent">
              <p><strong>⚠️ Action Required:</strong> A new appointment has been booked and requires your attention.</p>
            </div>
            
            <div class="details">
              <h3>👤 Citizen Information</h3>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Phone:</strong> ${user.phone}</p>
            </div>
            
            <div class="details">
              <h3>📅 Appointment Information</h3>
              <p><strong>Appointment ID:</strong> ${appointment.id}</p>
              <p><strong>Queue Number:</strong> ${appointment.queueNumber}</p>
              <p><strong>Ministry:</strong> ${appointment.ministryName}</p>
              <p><strong>Service:</strong> ${appointment.serviceName}</p>
              <p><strong>Location:</strong> ${appointment.location}, ${appointment.state}</p>
              <p><strong>Date:</strong> ${appointment.date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Booked At:</strong> ${new Date(appointment.createdAt).toLocaleString()}</p>
            </div>
            
            <div class="details">
              <h3>🎯 Next Steps</h3>
              <ul>
                <li>Review the appointment details</li>
                <li>Confirm or reschedule if necessary</li>
                <li>Prepare required documentation</li>
                <li>Update appointment status in admin panel</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>Nigerian Public Service Admin System</p>
            <p>This notification was sent automatically</p>
          </div>
        </div>
      </div>
      </html>
    `,
  }
}
