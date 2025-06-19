"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, CheckCircle, AlertTriangle, TrendingUp, Eye, Bell, FileText } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalAppointments: number
  todayAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  totalUsers: number
  todayRegistrations: number
  totalVisitors: number
  todayVisitors: number
}

interface RecentAppointment {
  id: string
  userName: string
  ministryName: string
  serviceName: string
  date: string
  time: string
  status: string
  createdAt: string
}

export function AdminDashboard() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalUsers: 0,
    todayRegistrations: 0,
    totalVisitors: 0,
    todayVisitors: 0,
  })
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = () => {
    try {
      // Load appointments
      const appointments = JSON.parse(localStorage.getItem("all_appointments") || "[]")
      const users = JSON.parse(localStorage.getItem("appointment_users") || "[]")
      const visitors = JSON.parse(localStorage.getItem("visitor_analytics") || "[]")

      const today = new Date().toDateString()

      // Calculate stats
      const todayAppointments = appointments.filter((apt: any) => new Date(apt.createdAt).toDateString() === today)
      const todayUsers = users.filter((user: any) => new Date(user.createdAt || Date.now()).toDateString() === today)
      const todayVisitors = visitors.filter((visitor: any) => new Date(visitor.timestamp).toDateString() === today)

      setStats({
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        pendingAppointments: appointments.filter((apt: any) => apt.status === "pending").length,
        confirmedAppointments: appointments.filter((apt: any) => apt.status === "confirmed").length,
        completedAppointments: appointments.filter((apt: any) => apt.status === "completed").length,
        cancelledAppointments: appointments.filter((apt: any) => apt.status === "cancelled").length,
        totalUsers: users.length,
        todayRegistrations: todayUsers.length,
        totalVisitors: visitors.length,
        todayVisitors: todayVisitors.length,
      })

      // Get recent appointments (last 10)
      const recent = appointments
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((apt: any) => {
          const user = users.find((u: any) => u.id === apt.userId)
          return {
            ...apt,
            userName: user?.name || "Unknown User",
          }
        })
      setRecentAppointments(recent)

      // Get recent users (last 5)
      const recentUsersList = users
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime(),
        )
        .slice(0, 5)
      setRecentUsers(recentUsersList)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
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

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      change: `+${stats.todayAppointments} today`,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Review",
      value: stats.pendingAppointments,
      change: "Needs attention",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Confirmed Today",
      value: stats.confirmedAppointments,
      change: "Ready to serve",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: `+${stats.todayRegistrations} new today`,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Site Visitors",
      value: stats.totalVisitors,
      change: `+${stats.todayVisitors} today`,
      icon: Eye,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Completed",
      value: stats.completedAppointments,
      change: "Successfully served",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">View All Appointments</h3>
                <p className="text-blue-100 text-sm">Manage and update appointment statuses</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
            <Button variant="secondary" size="sm" className="mt-4 bg-white text-blue-600 hover:bg-blue-50">
              <Link href="#" onClick={() => document.querySelector('[value="appointments"]')?.click()}>
                View Appointments
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-green-100 text-sm">View and manage registered users</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
            <Button variant="secondary" size="sm" className="mt-4 bg-white text-green-600 hover:bg-green-50">
              <Link href="#" onClick={() => document.querySelector('[value="users"]')?.click()}>
                Manage Users
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-purple-100 text-sm">View detailed system analytics</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
            <Button variant="secondary" size="sm" className="mt-4 bg-white text-purple-600 hover:bg-purple-50">
              <Link href="#" onClick={() => document.querySelector('[value="analytics"]')?.click()}>
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">System Status</h3>
                <p className="text-orange-100 text-sm">Monitor system health</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span className="text-sm text-orange-100">All Systems Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center text-gray-900">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Recent Appointments
            </CardTitle>
            <CardDescription>Latest appointment bookings requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentAppointments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No recent appointments</p>
              </div>
            ) : (
              <div className="divide-y">
                {recentAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{appointment.userName}</h4>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{appointment.serviceName}</p>
                    <p className="text-sm text-gray-500">{appointment.ministryName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(appointment.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {appointment.date} at {appointment.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {recentAppointments.length > 5 && (
              <div className="p-4 border-t bg-gray-50">
                <Button variant="outline" size="sm" className="w-full">
                  View All Appointments
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center text-gray-900">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Recent Registrations
            </CardTitle>
            <CardDescription>Newly registered users on the platform</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No recent registrations</p>
              </div>
            ) : (
              <div className="divide-y">
                {recentUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{user.role}</Badge>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-gray-900">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            System Health & Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Appointment System</h3>
              <p className="text-sm text-green-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-green-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-green-600">Operational</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
