"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Calendar, Clock, MapPin, User, Mail, Phone, Building2, FileText } from "lucide-react"
import Link from "next/link"

interface AppointmentDetails {
  id: string
  queueNumber: string
  ministryName: string
  serviceName: string
  location: string
  state: string
  date: string
  time: string
  status: string
  userName: string
  userEmail: string
  userPhone: string
  createdAt: string
}

export default function VerifyAppointmentPage() {
  const params = useParams()
  const appointmentId = params.id as string
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (appointmentId) {
      verifyAppointment(appointmentId)
    }
  }, [appointmentId])

  const verifyAppointment = (id: string) => {
    try {
      // Search in all appointments
      const allAppointments = JSON.parse(localStorage.getItem("all_appointments") || "[]")
      const foundAppointment = allAppointments.find((apt: any) => apt.id === id)

      if (foundAppointment) {
        // Get user details
        const allUsers = JSON.parse(localStorage.getItem("appointment_users") || "[]")
        const user = allUsers.find((u: any) => u.id === foundAppointment.userId)

        setAppointment({
          ...foundAppointment,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "",
          userPhone: user?.phone || "",
        })
      } else {
        setError("Appointment not found")
      }
    } catch (err) {
      setError("Error verifying appointment")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying appointment...</p>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Appointment Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || "The appointment ID could not be verified."}</p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Appointment Verified</h1>
          <p className="text-muted-foreground">Official appointment details confirmed</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center justify-between">
              <span>Appointment Details</span>
              <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
                {getStatusIcon(appointment.status)}
                {appointment.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Service Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.ministryName}</span>
                    </div>
                    <div className="pl-6">
                      <p className="text-muted-foreground">{appointment.serviceName}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule & Location
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {appointment.location}, {appointment.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Citizen Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.userName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.userEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.userPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Appointment References</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Appointment ID</p>
                      <p className="text-muted-foreground font-mono">{appointment.id}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Queue Number</p>
                      <p className="text-muted-foreground font-mono">{appointment.queueNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-blue-800">✅ Verification Complete</h3>
              <p className="text-sm text-blue-700 mb-4">
                This appointment has been successfully verified in the Nigerian Public Service system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/">Return Home</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/book-appointment">Book New Appointment</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
