"use client"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { BookingStep } from "@/app/book-appointment/page"

interface BookingStepsProps {
  currentStep: BookingStep
}

export function BookingSteps({ currentStep }: BookingStepsProps) {
  const { t } = useLanguage()

  const steps = [
    { key: "ministry", label: t("booking.steps.ministry") },
    { key: "service", label: t("booking.steps.service") },
    { key: "location", label: t("booking.steps.location") },
    { key: "datetime", label: t("booking.steps.datetime") },
    { key: "confirmation", label: t("booking.steps.confirmation") },
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === currentStep)
  }

  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  index < currentStepIndex
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStepIndex
                      ? "border-primary text-primary"
                      : "border-muted-foreground text-muted-foreground",
                )}
              >
                {index < currentStepIndex ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-20",
                  index <= currentStepIndex ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/30",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
