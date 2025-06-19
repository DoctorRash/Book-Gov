"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ministries } from "@/lib/data"
import Link from "next/link"
import { Search, ArrowRight, MapPin } from "lucide-react"

export default function MinistriesPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMinistries = ministries.filter(
    (ministry) =>
      ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("ministries.title")}</h1>
          <p className="text-muted-foreground">{t("ministries.subtitle")}</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("booking.searchMinistries")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMinistries.map((ministry) => (
            <Card key={ministry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ministry.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{ministry.name}</CardTitle>
                  </div>
                </div>
                <CardDescription className="line-clamp-3">{ministry.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">
                    {ministry.services.length} {t("ministries.services")}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>All States</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/ministries/${ministry.id}`}>
                      {t("common.viewDetails")}
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link href="/book-appointment">{t("nav.bookAppointment")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMinistries.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("booking.noMinistriesFound")}</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
