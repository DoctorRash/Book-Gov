"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ministries } from "@/lib/data"
import { Search } from "lucide-react"

interface MinistrySelectionProps {
  onSelect: (ministry: any) => void
}

export function MinistrySelection({ onSelect }: MinistrySelectionProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMinistries = ministries.filter(
    (ministry) =>
      ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t("booking.selectMinistry")}</h2>
        <p className="text-muted-foreground">{t("booking.selectMinistryDescription")}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t("booking.searchMinistries")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMinistries.map((ministry) => (
          <Card
            key={ministry.id}
            className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
            onClick={() => onSelect(ministry)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ministry.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{ministry.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3 line-clamp-2">{ministry.description}</CardDescription>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {ministry.services.length} {t("booking.services")}
                </Badge>
                <span className="text-sm text-primary font-medium">{t("common.select")} →</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMinistries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("booking.noMinistriesFound")}</p>
        </div>
      )}
    </div>
  )
}
