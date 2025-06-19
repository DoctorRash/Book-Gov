"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Shield, Zap, Heart, Award, Globe, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To digitize and streamline access to government services for all Nigerian citizens, making bureaucratic processes efficient and transparent.",
    },
    {
      icon: Users,
      title: "Citizen-Centered",
      description:
        "Every feature is designed with the citizen's convenience in mind, reducing wait times and improving service delivery.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security ensures your personal information is protected while maintaining 99.9% uptime.",
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Book appointments in minutes instead of hours, with real-time updates and smart queue management.",
    },
  ]

  const stats = [
    { label: "Government Ministries", value: "25+", icon: Heart },
    { label: "States Covered", value: "37", icon: Globe },
    { label: "Citizens Served", value: "10,000+", icon: Users },
    { label: "Appointments Booked", value: "50,000+", icon: CheckCircle },
  ]

  const team = [
    {
      name: "Dr. Adebayo Ogundimu",
      role: "Project Director",
      description: "Former Director of Digital Transformation, Federal Ministry of Communications",
    },
    {
      name: "Eng. Fatima Abdullahi",
      role: "Technical Lead",
      description: "Software Engineering Expert with 15+ years in government systems",
    },
    {
      name: "Mr. Chinedu Okwu",
      role: "Operations Manager",
      description: "Public Administration specialist focused on service delivery optimization",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About Our <span className="text-primary">Platform</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're revolutionizing how Nigerians access government services through digital innovation, making
                bureaucracy simple, transparent, and efficient.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Digital Government
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Citizen Services
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Innovation
                </Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Transparency
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why We Built This Platform</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our commitment to improving government service delivery through technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl text-muted-foreground">Real numbers showing the difference we're making</p>
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

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experienced professionals dedicated to transforming government service delivery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-primary/20">
                <CardContent className="pt-8">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Our Vision for Nigeria</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      We envision a Nigeria where every citizen can access government services with dignity, efficiency,
                      and transparency. Our platform is just the beginning of a digital transformation that will make
                      Nigeria a model for e-governance in Africa.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Accessibility</h3>
                        <p className="text-sm text-muted-foreground">
                          Services available to all citizens regardless of location or background
                        </p>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Transparency</h3>
                        <p className="text-sm text-muted-foreground">
                          Clear processes and real-time updates on all government interactions
                        </p>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Efficiency</h3>
                        <p className="text-sm text-muted-foreground">
                          Reduced wait times and streamlined processes for better service delivery
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
