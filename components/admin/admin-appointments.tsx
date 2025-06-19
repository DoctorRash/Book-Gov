"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Send,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sendEmail } from "@/lib/brevo"

interface Appointment {
  id: string
  userId: string
  ministryName: string
  serviceName: string
  location: string
  state: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  queueNumber: string
  createdAt: string
  userName?: string
  userEmail?: string
  userPhone?: string
  notes?: string
  adminNotes?: string
  confirmationDate?: string
  completionDate?: string
}

export function AdminAppointments() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, statusFilter, dateFilter])

  const loadAppointments = () => {
    setLoading(true)
    try {
      const appointmentsData = JSON.parse(localStorage.getItem("all_appointments") || "[]")
      const usersData = JSON.parse(localStorage.getItem("appointment_users") || "[]")

      // Enrich appointments with user data
      const enrichedAppointments = appointmentsData.map((apt: any) => {
        const user = usersData.find((u: any) => u.id === apt.userId)
        return {
          ...apt,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "",
          userPhone: user?.phone || "",
        }
      })

      setAppointments(enrichedAppointments)
    } catch (error) {
      console.error("Error loading appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.ministryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.queueNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date()
      const todayStr = today.toDateString()

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((apt) => new Date(apt.createdAt).toDateString() === todayStr)
          break
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((apt) => new Date(apt.createdAt) >= weekAgo)
          break
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((apt) => new Date(apt.createdAt) >= monthAgo)
          break
      }
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredAppointments(filtered)
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string, notes?: string) => {
    setIsUpdating(true)
    try {
      const timestamp = new Date().toISOString()

      // Update in all appointments
      const allAppointments = JSON.parse(localStorage.getItem("all_appointments") || "[]")
      const updatedAllAppointments = allAppointments.map((apt: any) => {
        if (apt.id === appointmentId) {
          const updatedApt = {
            ...apt,
            status: newStatus,
            adminNotes: notes || apt.adminNotes,
          }

          // Add timestamp based on status
          if (newStatus === "confirmed") {
            updatedApt.confirmationDate = timestamp
          } else if (newStatus === "completed") {
            updatedApt.completionDate = timestamp
          }

          return updatedApt
        }
        return apt
      })
      localStorage.setItem("all_appointments", JSON.stringify(updatedAllAppointments))

      // Update in user's appointments
      const appointment = updatedAllAppointments.find((apt: any) => apt.id === appointmentId)
      if (appointment) {
        const userAppointments = JSON.parse(localStorage.getItem(`appointments_${appointment.userId}`) || "[]")
        const updatedUserAppointments = userAppointments.map((apt: any) =>
          apt.id === appointmentId ? appointment : apt,
        )
        localStorage.setItem(`appointments_${appointment.userId}`, JSON.stringify(updatedUserAppointments))

        // Send email notification for status changes
        if (newStatus === "confirmed" || newStatus === "cancelled") {
          try {
            const user = JSON.parse(localStorage.getItem("appointment_users") || "[]").find(
              (u: any) => u.id === appointment.userId,
            )

            if (user) {
              const emailTemplate = generateStatusUpdateEmailTemplate(appointment, user, newStatus, notes)
              await sendEmail({
                to: user.email,
                subject: emailTemplate.subject,
                htmlContent: emailTemplate.htmlContent,
              })
            }
          } catch (emailError) {
            console.error("Error sending status update email:", emailError)
          }
        }
      }

      // Update local state
      setAppointments(
        updatedAllAppointments.map((apt: any) => {
          const user = JSON.parse(localStorage.getItem("appointment_users") || "[]").find(
            (u: any) => u.id === apt.userId,
          )
          return {
            ...apt,
            userName: user?.name || "Unknown User",
            userEmail: user?.email || "",
            userPhone: user?.phone || "",
          }
        }),
      )

      toast({
        title: "Status Updated Successfully",
        description: `Appointment status changed to ${newStatus}${notes ? " with notes" : ""}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleQuickStatusUpdate = (appointmentId: string, newStatus: string) => {
    updateAppointmentStatus(appointmentId, newStatus)
  }

  const handleDetailedStatusUpdate = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, selectedAppointment.status, adminNotes)
      setSelectedAppointment(null)
      setAdminNotes("")
    }
  }

  const exportAppointments = () => {
    const csvContent = [
      [
        "ID",
        "User Name",
        "Email",
        "Phone",
        "Ministry",
        "Service",
        "Location",
        "State",
        "Date",
        "Time",
        "Status",
        "Queue Number",
        "Created At",
        "Confirmed At",
        "Completed At",
        "Admin Notes",
      ],
      ...filteredAppointments.map((apt) => [
        apt.id,
        apt.userName,
        apt.userEmail,
        apt.userPhone,
        apt.ministryName,
        apt.serviceName,
        apt.location,
        apt.state,
        apt.date,
        apt.time,
        apt.status,
        apt.queueNumber,
        new Date(apt.createdAt).toLocaleString(),
        apt.confirmationDate ? new Date(apt.confirmationDate).toLocaleString() : "",
        apt.completionDate ? new Date(apt.completionDate).toLocaleString() : "",
        apt.adminNotes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Loading appointments...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
          <p className="text-gray-600">Manage, confirm, and track all appointment bookings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadAppointments} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={exportAppointments} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {appointments.filter((apt) => apt.status === "pending").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter((apt) => apt.status === "confirmed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter((apt) => apt.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {appointments.filter((apt) => apt.status === "cancelled").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500 flex items-center">
              <span className="font-medium">{filteredAppointments.length}</span> appointments found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Appointment Details</span>
            <Badge variant="secondary">{filteredAppointments.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
              <p className="text-muted-foreground">No appointments match your current filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-bold text-xl text-gray-900">{appointment.ministryName}</h3>
                        <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-lg text-gray-700 mb-2">{appointment.serviceName}</p>
                      <p className="text-sm text-gray-500">Appointment ID: {appointment.id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setAdminNotes(appointment.adminNotes || "")
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Manage Appointment</DialogTitle>
                            <DialogDescription>
                              Update status and add notes for appointment {appointment.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Current Status</label>
                                <Select
                                  value={selectedAppointment?.status}
                                  onValueChange={(value) =>
                                    setSelectedAppointment((prev) => (prev ? { ...prev, status: value as any } : null))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Queue Number</label>
                                <Input value={appointment.queueNumber} disabled />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Admin Notes</label>
                              <Textarea
                                placeholder="Add notes about this appointment..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={3}
                              />
                            </div>
                            {appointment.adminNotes && (
                              <div>
                                <label className="text-sm font-medium">Previous Notes</label>
                                <div className="bg-gray-100 p-3 rounded text-sm">{appointment.adminNotes}</div>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleDetailedStatusUpdate}
                              disabled={isUpdating}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isUpdating ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4 mr-2" />
                              )}
                              Update Appointment
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickStatusUpdate(appointment.id, "confirmed")}
                        disabled={
                          appointment.status === "confirmed" || appointment.status === "completed" || isUpdating
                        }
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickStatusUpdate(appointment.id, "completed")}
                        disabled={
                          appointment.status === "completed" || appointment.status === "cancelled" || isUpdating
                        }
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickStatusUpdate(appointment.id, "cancelled")}
                        disabled={
                          appointment.status === "completed" || appointment.status === "cancelled" || isUpdating
                        }
                        className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>

                      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedAppointment(appointment)}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Appointment Details</DialogTitle>
                            <DialogDescription>Complete information for appointment {appointment.id}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Citizen Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span>{appointment.userName}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{appointment.userEmail}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{appointment.userPhone}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <strong>Ministry:</strong> {appointment.ministryName}
                                  </p>
                                  <p>
                                    <strong>Service:</strong> {appointment.serviceName}
                                  </p>
                                  <p>
                                    <strong>Queue Number:</strong> {appointment.queueNumber}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Schedule & Location</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span>{appointment.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span>
                                      {appointment.location}, {appointment.state}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Status Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p>
                                    <strong>Status:</strong>
                                    <Badge className={`ml-2 ${getStatusColor(appointment.status)}`}>
                                      {appointment.status.toUpperCase()}
                                    </Badge>
                                  </p>
                                  <p>
                                    <strong>Created:</strong> {new Date(appointment.createdAt).toLocaleString()}
                                  </p>
                                  {appointment.confirmationDate && (
                                    <p>
                                      <strong>Confirmed:</strong>{" "}
                                      {new Date(appointment.confirmationDate).toLocaleString()}
                                    </p>
                                  )}
                                  {appointment.completionDate && (
                                    <p>
                                      <strong>Completed:</strong>{" "}
                                      {new Date(appointment.completionDate).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {appointment.adminNotes && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Admin Notes</h4>
                              <div className="bg-gray-100 p-3 rounded text-sm">{appointment.adminNotes}</div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 border-b pb-1">Citizen Information</h4>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{appointment.userName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{appointment.userEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{appointment.userPhone}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 border-b pb-1">Appointment Details</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{appointment.time}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Queue: <span className="font-medium">{appointment.queueNumber}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 border-b pb-1">Location</h4>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{appointment.location}</span>
                      </div>
                      <div className="text-sm text-gray-600">{appointment.state}</div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 border-b pb-1">Booking Info</h4>
                      <div className="text-sm text-gray-600">
                        <div>Booked: {new Date(appointment.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(appointment.createdAt).toLocaleTimeString()}
                        </div>
                        {appointment.confirmationDate && (
                          <div className="text-xs text-green-600 mt-1">
                            Confirmed: {new Date(appointment.confirmationDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to generate status update email template
function generateStatusUpdateEmailTemplate(appointment: any, user: any, newStatus: string, notes?: string) {
  const statusMessages = {
    confirmed: {
      subject: `Appointment Confirmed - ${appointment.ministryName}`,
      title: "✅ Appointment Confirmed",
      message: "Great news! Your appointment has been confirmed.",
      color: "#22c55e",
    },
    cancelled: {
      subject: `Appointment Cancelled - ${appointment.ministryName}`,
      title: "❌ Appointment Cancelled",
      message: "We regret to inform you that your appointment has been cancelled.",
      color: "#dc2626",
    },
  }

  const statusInfo = statusMessages[newStatus as keyof typeof statusMessages]

  return {
    subject: statusInfo.subject,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusInfo.color}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .appointment-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🇳🇬 Nigerian Public Service</h1>
            <h2>${statusInfo.title}</h2>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <p>${statusInfo.message}</p>
            
            <div class="appointment-details">
              <h3>📋 Appointment Details</h3>
              <p><strong>Appointment ID:</strong> ${appointment.id}</p>
              <p><strong>Queue Number:</strong> ${appointment.queueNumber}</p>
              <p><strong>Ministry:</strong> ${appointment.ministryName}</p>
              <p><strong>Service:</strong> ${appointment.serviceName}</p>
              <p><strong>Location:</strong> ${appointment.location}, ${appointment.state}</p>
              <p><strong>Date:</strong> ${appointment.date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              <p><strong>Status:</strong> ${newStatus.toUpperCase()}</p>
            </div>
            
            ${
              notes
                ? `
            <div class="appointment-details">
              <h3>📝 Additional Notes</h3>
              <p>${notes}</p>
            </div>
            `
                : ""
            }
            
            <p>If you have any questions, please contact us as soon as possible.</p>
            
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
