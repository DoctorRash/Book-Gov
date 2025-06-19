"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, FileText, MapPin, Calendar, Clock, User, Mail, Phone, Loader2 } from "lucide-react"
import type { BookingData } from "@/app/book-appointment/page"

interface BookingConfirmationProps {
  bookingData: BookingData
  user: any
  onConfirm: (appointmentId: string, queueNumber: string) => void
  onBack: () => void
}

export function BookingConfirmation({ bookingData, user, onConfirm, onBack }: BookingConfirmationProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  // Fix appointment saving to ensure proper admin integration
  const handleConfirm = async () => {
    setLoading(true)

    // Generate appointment ID and queue number
    const appointmentId = `APT-${Date.now()}`
    const queueNumber = `Q${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`

    // Save appointment with all required fields
    const appointment = {
      id: appointmentId,
      userId: user.id,
      ministryName: bookingData.ministry?.name,
      serviceName: bookingData.service?.name,
      location: bookingData.location,
      state: bookingData.state,
      date: bookingData.date,
      time: bookingData.time,
      status: "pending",
      queueNumber,
      createdAt: new Date().toISOString(),
      // Add user details for admin convenience
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
    }

    // Save to user's appointments
    const existingAppointments = JSON.parse(localStorage.getItem(`appointments_${user.id}`) || "[]")
    existingAppointments.push(appointment)
    localStorage.setItem(`appointments_${user.id}`, JSON.stringify(existingAppointments))

    // Save to all appointments (for admin)
    const allAppointments = JSON.parse(localStorage.getItem("all_appointments") || "[]")
    allAppointments.push(appointment)
    localStorage.setItem("all_appointments", JSON.stringify(allAppointments))

    // Ensure user is in users list
    const allUsers = JSON.parse(localStorage.getItem("appointment_users") || "[]")
    const userExists = allUsers.find((u: any) => u.id === user.id)
    if (!userExists) {
      allUsers.push({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("appointment_users", JSON.stringify(allUsers))
    }

    // Send notification to admin
    try {
      await fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new_appointment",
          appointment,
          user,
        }),
      })
    } catch (error) {
      console.error("Failed to notify admin:", error)
    }

    // Add visitor analytics
    const visitors = JSON.parse(localStorage.getItem("visitor_analytics") || "[]")
    visitors.push({
      id: Date.now().toString(),
      sessionId: `session_${user.id}_${Date.now()}`,
      page: "/book-appointment",
      action: "appointment_booked",
      timestamp: new Date().toISOString(),
      userId: user.id,
    })
    localStorage.setItem("visitor_analytics", JSON.stringify(visitors))

    setTimeout(() => {
      setLoading(false)
      onConfirm(appointmentId, queueNumber)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{t("booking.confirmBooking")}</h2>
          <p className="text-muted-foreground">{t("booking.confirmBookingDescription")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t("booking.appointmentDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{bookingData.ministry?.name}</p>
                <p className="text-sm text-muted-foreground">{t("booking.ministry")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{bookingData.service?.name}</p>
                <p className="text-sm text-muted-foreground">{t("booking.service")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{bookingData.location}</p>
                <p className="text-sm text-muted-foreground">{bookingData.state}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{bookingData.date}</p>
                <p className="text-sm text-muted-foreground">{t("booking.date")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{bookingData.time}</p>
                <p className="text-sm text-muted-foreground">{t("booking.time")}</p>
              </div>
            </div>

            {bookingData.service?.fee && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t("booking.serviceFee")}</span>
                  <span className="font-bold">₦{bookingData.service.fee.toLocaleString()}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t("booking.personalDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{t("auth.fullName")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">{t("auth.email")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{user.phone}</p>
                <p className="text-sm text-muted-foreground">{t("auth.phone")}</p>
              </div>
            </div>

            <Separator />

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">{t("booking.importantNotes")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("booking.note1")}</li>
                <li>• {t("booking.note2")}</li>
                <li>• {t("booking.note3")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Button */}
      <Card className="border-primary">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{t("booking.readyToBook")}</h3>
            <p className="text-muted-foreground mb-4">{t("booking.confirmationMessage")}</p>
            <Button size="lg" onClick={handleConfirm} disabled={loading} className="min-w-32">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? t("booking.booking") : t("booking.confirmAppointment")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
