"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Calendar, Clock, MapPin, Shield } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-primary">{t("hero.title.part1")}</span>
            <br />
            {t("hero.title.part2")}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("hero.subtitle")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/book-appointment">
                <Calendar className="mr-2 h-5 w-5" />
                {t("hero.cta.primary")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/ministries">{t("hero.cta.secondary")}</Link>
            </Button>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("hero.benefits.time.title")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("hero.benefits.time.description")}</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("hero.benefits.location.title")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("hero.benefits.location.description")}</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("hero.benefits.secure.title")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("hero.benefits.secure.description")}</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("hero.benefits.easy.title")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("hero.benefits.easy.description")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
