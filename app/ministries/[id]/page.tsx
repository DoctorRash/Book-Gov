"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ministries } from "@/lib/data"
import Link from "next/link"
import { ArrowLeft, Clock, FileText, MapPin, DollarSign } from "lucide-react"

export default function MinistryDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const ministry = ministries.find((m) => m.id === params.id)

  if (!ministry) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Ministry Not Found</h1>
            <p className="text-muted-foreground mb-4">The requested ministry could not be found.</p>
            <Button asChild>
              <Link href="/ministries">Back to Ministries</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/ministries">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
        </div>

        {/* Ministry Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ministry.icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{ministry.name}</h1>
              <p className="text-muted-foreground">{ministry.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              {ministry.services.length} {t("ministries.services")}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Available in all 36 states + FCT</span>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ministry.services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    {service.name}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{service.duration} minutes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">₦{service.fee?.toLocaleString() || "Free"}</span>
                      </div>
                    </div>

                    {service.requirements && service.requirements.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium mb-2">Required Documents:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {service.requirements.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    <Separator />
                    <Button asChild className="w-full">
                      <Link href="/book-appointment">Book This Service</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Book Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Ready to Book an Appointment?</h3>
              <p className="text-muted-foreground mb-4">
                Start the booking process and select your preferred service from {ministry.name}
              </p>
              <Button size="lg" asChild>
                <Link href="/book-appointment">{t("nav.bookAppointment")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
