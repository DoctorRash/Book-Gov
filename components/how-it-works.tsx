"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Building2, Calendar, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const { t } = useLanguage()

  const steps = [
    {
      icon: UserPlus,
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
      step: "01",
    },
    {
      icon: Building2,
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
      step: "02",
    },
    {
      icon: Calendar,
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
      step: "03",
    },
    {
      icon: CheckCircle,
      title: t("howItWorks.step4.title"),
      description: t("howItWorks.step4.description"),
      step: "04",
    },
  ]

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("howItWorks.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
