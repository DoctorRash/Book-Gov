"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { nigerianStates } from "@/lib/data"
import { Search, ArrowLeft, MapPin } from "lucide-react"

interface LocationSelectionProps {
  onSelect: (location: string, state: string) => void
  onBack: () => void
}

export function LocationSelection({ onSelect, onBack }: LocationSelectionProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const filteredStates = nigerianStates.filter((state) => state.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleLocationSelect = (location: string, state: string) => {
    onSelect(location, state)
  }

  if (selectedState) {
    const state = nigerianStates.find((s) => s.name === selectedState)
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setSelectedState(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{t("booking.selectLocation")}</h2>
            <p className="text-muted-foreground">{selectedState}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state?.locations.map((location, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
              onClick={() => handleLocationSelect(location, selectedState)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  {location}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-right">
                  <span className="text-sm text-primary font-medium">{t("common.select")} →</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{t("booking.selectState")}</h2>
          <p className="text-muted-foreground">{t("booking.selectStateDescription")}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t("booking.searchStates")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStates.map((state) => (
          <Card
            key={state.name}
            className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
            onClick={() => setSelectedState(state.name)}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                {state.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {state.locations.length} {t("booking.locations")}
              </p>
              <div className="text-right">
                <span className="text-sm text-primary font-medium">{t("common.select")} →</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("booking.noStatesFound")}</p>
        </div>
      )}
    </div>
  )
}
