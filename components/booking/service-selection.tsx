"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft, Clock, FileText } from "lucide-react"

interface ServiceSelectionProps {
  ministry: any
  onSelect: (service: any) => void
  onBack: () => void
}

export function ServiceSelection({ ministry, onSelect, onBack }: ServiceSelectionProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  if (!ministry) return null

  const filteredServices = ministry.services.filter(
    (service: any) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{t("booking.selectService")}</h2>
          <p className="text-muted-foreground">{ministry.name}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t("booking.searchServices")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service: any) => (
          <Card
            key={service.id}
            className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
            onClick={() => onSelect(service)}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{service.description}</CardDescription>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {service.duration} {t("booking.minutes")}
                    </span>
                  </div>
                  <Badge variant="outline">₦{service.fee?.toLocaleString() || "0"}</Badge>
                </div>

                {service.requirements && service.requirements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">{t("booking.requirements")}:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {service.requirements.slice(0, 2).map((req: string, index: number) => (
                        <li key={index}>• {req}</li>
                      ))}
                      {service.requirements.length > 2 && (
                        <li>• {t("booking.andMore", { count: service.requirements.length - 2 })}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-4 text-right">
                <span className="text-sm text-primary font-medium">{t("common.select")} →</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("booking.noServicesFound")}</p>
        </div>
      )}
    </div>
  )
}
