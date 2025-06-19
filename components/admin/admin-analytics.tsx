"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Eye, Calendar, MapPin } from "lucide-react"

interface AnalyticsData {
  appointmentsByMinistry: { name: string; count: number }[]
  appointmentsByStatus: { name: string; count: number; color: string }[]
  appointmentsByState: { name: string; count: number }[]
  visitorsByDay: { date: string; visitors: number; registrations: number }[]
  popularPages: { page: string; views: number }[]
  totalStats: {
    totalVisitors: number
    uniqueVisitors: number
    totalPageViews: number
    totalRegistrations: number
    conversionRate: number
  }
}

export function AdminAnalytics() {
  const { t } = useLanguage()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    appointmentsByMinistry: [],
    appointmentsByStatus: [],
    appointmentsByState: [],
    visitorsByDay: [],
    popularPages: [],
    totalStats: {
      totalVisitors: 0,
      uniqueVisitors: 0,
      totalPageViews: 0,
      totalRegistrations: 0,
      conversionRate: 0,
    },
  })

  useEffect(() => {
    loadAnalytics()
    // Refresh analytics every 30 seconds
    const interval = setInterval(loadAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadAnalytics = () => {
    try {
      // Load appointments
      const appointments = JSON.parse(localStorage.getItem("all_appointments") || "[]")

      // Load users
      const users = JSON.parse(localStorage.getItem("appointment_users") || "[]")

      // Generate sample visitor data if none exists
      let visitors = JSON.parse(localStorage.getItem("visitor_analytics") || "[]")
      if (visitors.length === 0) {
        // Generate sample data for demo
        visitors = generateSampleVisitorData()
        localStorage.setItem("visitor_analytics", JSON.stringify(visitors))
      }

      // Process appointments by ministry
      const ministryCount: { [key: string]: number } = {}
      appointments.forEach((apt: any) => {
        const shortName = apt.ministryName?.substring(0, 25) + "..." || "Unknown"
        ministryCount[shortName] = (ministryCount[shortName] || 0) + 1
      })
      const appointmentsByMinistry = Object.entries(ministryCount)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Process appointments by status
      const statusCount: { [key: string]: number } = {}
      appointments.forEach((apt: any) => {
        statusCount[apt.status] = (statusCount[apt.status] || 0) + 1
      })
      const appointmentsByStatus = Object.entries(statusCount).map(([name, count]) => ({
        name,
        count: count as number,
        color:
          name === "pending"
            ? "#f59e0b"
            : name === "confirmed"
              ? "#3b82f6"
              : name === "completed"
                ? "#10b981"
                : "#ef4444",
      }))

      // Process appointments by state
      const stateCount: { [key: string]: number } = {}
      appointments.forEach((apt: any) => {
        if (apt.state) {
          stateCount[apt.state] = (stateCount[apt.state] || 0) + 1
        }
      })
      const appointmentsByState = Object.entries(stateCount)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Process visitors by day (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toDateString()
      }).reverse()

      const visitorsByDay = last7Days.map((date) => {
        const dayVisitors = visitors.filter((v: any) => new Date(v.timestamp).toDateString() === date)
        const dayRegistrations = users.filter((u: any) => new Date(u.createdAt || Date.now()).toDateString() === date)

        return {
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          visitors: dayVisitors.length,
          registrations: dayRegistrations.length,
        }
      })

      // Process popular pages
      const pageCount: { [key: string]: number } = {}
      visitors.forEach((visitor: any) => {
        const page = visitor.page || "/"
        pageCount[page] = (pageCount[page] || 0) + 1
      })
      const popularPages = Object.entries(pageCount)
        .map(([page, views]) => ({ page, views: views as number }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)

      // Calculate total stats
      const uniqueVisitors = new Set(visitors.map((v: any) => v.sessionId || v.id)).size
      const totalPageViews = visitors.length
      const totalRegistrations = users.length
      const conversionRate = uniqueVisitors > 0 ? (totalRegistrations / uniqueVisitors) * 100 : 0

      setAnalytics({
        appointmentsByMinistry,
        appointmentsByStatus,
        appointmentsByState,
        visitorsByDay,
        popularPages,
        totalStats: {
          totalVisitors: visitors.length,
          uniqueVisitors,
          totalPageViews,
          totalRegistrations,
          conversionRate,
        },
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    }
  }

  const generateSampleVisitorData = () => {
    const sampleData = []
    const pages = ["/", "/ministries", "/book-appointment", "/about", "/contact", "/login", "/register"]

    // Generate data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Generate 10-50 visitors per day
      const visitorsCount = Math.floor(Math.random() * 40) + 10

      for (let j = 0; j < visitorsCount; j++) {
        const visitTime = new Date(date)
        visitTime.setHours(Math.floor(Math.random() * 24))
        visitTime.setMinutes(Math.floor(Math.random() * 60))

        sampleData.push({
          id: `visitor_${date.getTime()}_${j}`,
          sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
          page: pages[Math.floor(Math.random() * pages.length)],
          timestamp: visitTime.toISOString(),
          action: "page_view",
        })
      }
    }

    return sampleData
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.totalVisitors")}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStats.totalVisitors}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalStats.uniqueVisitors} {t("admin.analytics.unique")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.pageViews")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStats.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">{t("admin.analytics.totalPages")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.registrations")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStats.totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">{t("admin.analytics.newUsers")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.conversionRate")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{t("admin.analytics.visitorToUser")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.analytics.appointments")}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.appointmentsByStatus.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t("admin.analytics.totalBooked")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors by Day */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.analytics.visitorTrend")}</CardTitle>
            <CardDescription>{t("admin.analytics.visitorTrendDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.visitorsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" name={t("admin.analytics.visitors")} />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="#10b981"
                  name={t("admin.analytics.registrations")}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointments by Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.analytics.appointmentStatus")}</CardTitle>
            <CardDescription>{t("admin.analytics.appointmentStatusDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {analytics.appointmentsByStatus.length > 0 ? (
                <PieChart>
                  <Pie
                    data={analytics.appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.appointmentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No appointment data available
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Ministries */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.analytics.topMinistries")}</CardTitle>
            <CardDescription>{t("admin.analytics.topMinistriesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {analytics.appointmentsByMinistry.length > 0 ? (
                <BarChart data={analytics.appointmentsByMinistry} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No ministry data available
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.analytics.popularPages")}</CardTitle>
            <CardDescription>{t("admin.analytics.popularPagesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.popularPages.length > 0 ? (
                analytics.popularPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{page.page}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{page.views} views</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">No page data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* States Chart */}
      {analytics.appointmentsByState.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              {t("admin.analytics.appointmentsByState")}
            </CardTitle>
            <CardDescription>{t("admin.analytics.appointmentsByStateDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.appointmentsByState}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
