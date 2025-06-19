"use client"

import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">NG</span>
              </div>
              <span className="font-bold text-lg">{t("footer.title")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("footer.description")}</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("footer.quickLinks")}</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary">
                {t("nav.home")}
              </Link>
              <Link href="/ministries" className="block text-sm text-muted-foreground hover:text-primary">
                {t("nav.ministries")}
              </Link>
              <Link href="/book-appointment" className="block text-sm text-muted-foreground hover:text-primary">
                {t("nav.bookAppointment")}
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary">
                {t("nav.about")}
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("footer.services")}</h3>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{t("footer.passportServices")}</div>
              <div className="text-sm text-muted-foreground">{t("footer.healthServices")}</div>
              <div className="text-sm text-muted-foreground">{t("footer.educationServices")}</div>
              <div className="text-sm text-muted-foreground">{t("footer.immigrationServices")}</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("footer.contact")}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@nigerianappointments.gov.ng</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+234 800 BOOK NOW</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Federal Capital Territory, Abuja</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 {t("footer.title")}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
