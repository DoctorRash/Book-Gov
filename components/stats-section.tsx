"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Calendar, MapPin } from "lucide-react"

export function StatsSection() {
  const { t } = useLanguage()

  const stats = [
    {
      icon: Building2,
      value: "25+",
      label: t("stats.ministries"),
    },
    {
      icon: MapPin,
      value: "37",
      label: t("stats.locations"),
    },
    {
      icon: Users,
      value: "10K+",
      label: t("stats.users"),
    },
    {
      icon: Calendar,
      value: "50K+",
      label: t("stats.appointments"),
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("stats.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("stats.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
