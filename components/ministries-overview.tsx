"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ministries } from "@/lib/data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MinistriesOverview() {
  const { t } = useLanguage()

  // Show top 8 ministries
  const topMinistries = ministries.slice(0, 8)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ministries.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("ministries.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {topMinistries.map((ministry) => (
            <Card key={ministry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ministry.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{ministry.name}</CardTitle>
                <CardDescription className="line-clamp-2">{ministry.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {ministry.services.length} {t("ministries.services")}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/ministries/${ministry.id}`}>
                      {t("common.viewDetails")}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/ministries">
              {t("ministries.viewAll")} ({ministries.length} {t("ministries.total")})
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
