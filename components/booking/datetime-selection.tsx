"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react"

interface DateTimeSelectionProps {
  onSelect: (date: string, time: string) => void
  onBack: () => void
}

export function DateTimeSelection({ onSelect, onBack }: DateTimeSelectionProps) {
  const { t } = useLanguage()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Generate available time slots (9 AM to 5 PM, excluding lunch 12-1 PM)
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time when date changes
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.toLocaleDateString("en-GB")
      onSelect(formattedDate, selectedTime)
    }
  }

  // Disable past dates and weekends
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 || date.getDay() === 6
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{t("booking.selectDateTime")}</h2>
          <p className="text-muted-foreground">{t("booking.selectDateTimeDescription")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              {t("booking.selectDate")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
            />
            <p className="text-xs text-muted-foreground mt-2">{t("booking.weekdaysOnly")}</p>
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              {t("booking.selectTime")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className="justify-center"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">{t("booking.selectDateFirst")}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation */}
      {selectedDate && selectedTime && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t("booking.selectedDateTime")}</h3>
                <p className="text-muted-foreground">
                  {selectedDate.toLocaleDateString("en-GB")} at {selectedTime}
                </p>
              </div>
              <Button onClick={handleConfirm}>{t("common.continue")}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
