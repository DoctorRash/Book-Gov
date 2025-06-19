"use client"

import { useState, useEffect } from "react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load existing notifications
    loadNotifications()

    // Set up polling instead of SSE for better compatibility
    const pollInterval = setInterval(() => {
      checkForNewNotifications()
    }, 10000) // Check every 10 seconds

    return () => {
      clearInterval(pollInterval)
    }
  }, [])

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem("admin_notifications")
      if (stored) {
        setNotifications(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  // Fix notification system to work properly with localStorage
  const checkForNewNotifications = () => {
    try {
      // Check for new appointments
      const appointments = JSON.parse(localStorage.getItem("all_appointments") || "[]")
      const existingNotifications = JSON.parse(localStorage.getItem("admin_notifications") || "[]")

      // Get the last check timestamp
      const lastCheckTime = localStorage.getItem("last_notification_check")
      const lastCheck = lastCheckTime ? new Date(lastCheckTime).getTime() : 0

      // Find new appointments since last check
      const newAppointments = appointments.filter((apt: any) => new Date(apt.createdAt).getTime() > lastCheck)

      // Check for new users
      const users = JSON.parse(localStorage.getItem("appointment_users") || "[]")
      const newUsers = users.filter((user: any) => new Date(user.createdAt || Date.now()).getTime() > lastCheck)

      // Create notifications for new appointments
      newAppointments.forEach((apt: any) => {
        const notification = {
          id: `apt_${apt.id}_${Date.now()}`,
          type: "new_appointment",
          title: "New Appointment Booked",
          message: `New appointment for ${apt.serviceName} at ${apt.ministryName}`,
          timestamp: apt.createdAt,
          read: false,
        }
        addNotification(notification)
      })

      // Create notifications for new users
      newUsers.forEach((user: any) => {
        const notification = {
          id: `user_${user.id}_${Date.now()}`,
          type: "user_registration",
          title: "New User Registered",
          message: `${user.name} has registered on the platform`,
          timestamp: user.createdAt,
          read: false,
        }
        addNotification(notification)
      })

      // Update last check timestamp
      localStorage.setItem("last_notification_check", new Date().toISOString())
    } catch (error) {
      console.error("Error checking for new notifications:", error)
    }
  }

  const saveNotifications = (notifs: Notification[]) => {
    try {
      localStorage.setItem("admin_notifications", JSON.stringify(notifs))
      setNotifications(notifs)
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => {
      // Check if notification already exists
      const exists = prev.some((n) => n.id === notification.id)
      if (exists) return prev

      const updated = [notification, ...prev].slice(0, 50) // Keep only last 50
      saveNotifications(updated)
      return updated
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      saveNotifications(updated)
      return updated
    })
  }

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((notif) => ({ ...notif, read: true }))
      saveNotifications(updated)
      return updated
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
  }
}
