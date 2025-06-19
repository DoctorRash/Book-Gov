"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingSteps } from "@/components/booking-steps"
import { MinistrySelection } from "@/components/booking/ministry-selection"
import { ServiceSelection } from "@/components/booking/service-selection"
import { LocationSelection } from "@/components/booking/location-selection"
import { DateTimeSelection } from "@/components/booking/datetime-selection"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { BookingSuccess } from "@/components/booking/booking-success"

export type BookingStep = "ministry" | "service" | "location" | "datetime" | "confirmation" | "success"

export interface BookingData {
  ministry?: any
  service?: any
  location?: string
  state?: string
  date?: string
  time?: string
  appointmentId?: string
  queueNumber?: string
}

export default function BookAppointmentPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<BookingStep>("ministry")
  const [bookingData, setBookingData] = useState<BookingData>({})

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    const steps: BookingStep[] = ["ministry", "service", "location", "datetime", "confirmation", "success"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const steps: BookingStep[] = ["ministry", "service", "location", "datetime", "confirmation", "success"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case "ministry":
        return (
          <MinistrySelection
            onSelect={(ministry) => {
              updateBookingData({ ministry })
              nextStep()
            }}
          />
        )
      case "service":
        return (
          <ServiceSelection
            ministry={bookingData.ministry}
            onSelect={(service) => {
              updateBookingData({ service })
              nextStep()
            }}
            onBack={prevStep}
          />
        )
      case "location":
        return (
          <LocationSelection
            onSelect={(location, state) => {
              updateBookingData({ location, state })
              nextStep()
            }}
            onBack={prevStep}
          />
        )
      case "datetime":
        return (
          <DateTimeSelection
            onSelect={(date, time) => {
              updateBookingData({ date, time })
              nextStep()
            }}
            onBack={prevStep}
          />
        )
      case "confirmation":
        return (
          <BookingConfirmation
            bookingData={bookingData}
            user={user}
            onConfirm={(appointmentId, queueNumber) => {
              updateBookingData({ appointmentId, queueNumber })
              nextStep()
            }}
            onBack={prevStep}
          />
        )
      case "success":
        return <BookingSuccess bookingData={bookingData} user={user} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("booking.title")}</h1>
            <p className="text-muted-foreground">{t("booking.subtitle")}</p>
          </div>

          {currentStep !== "success" && <BookingSteps currentStep={currentStep} />}

          <div className="mt-8">{renderStep()}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
