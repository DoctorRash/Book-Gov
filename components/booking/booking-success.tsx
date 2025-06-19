"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, MapPin, FileText, Download, Share, QrCode, Smartphone } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { generateAdvancedQRCode } from "@/lib/qr-generator"
import type { BookingData } from "@/app/book-appointment/page"

interface BookingSuccessProps {
  bookingData: BookingData
  user: any
}

export function BookingSuccess({ bookingData, user }: BookingSuccessProps) {
  const { t } = useLanguage()
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [qrCodeData, setQrCodeData] = useState<any>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(true)

  useEffect(() => {
    // Generate QR code with comprehensive appointment details
    const appointmentData = {
      id: bookingData.appointmentId,
      queueNumber: bookingData.queueNumber,
      ministry: bookingData.ministry?.name,
      service: bookingData.service?.name,
      location: `${bookingData.location}, ${bookingData.state}`,
      date: bookingData.date,
      time: bookingData.time,
      citizen: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      status: "Pending Confirmation",
      createdAt: new Date().toISOString(),
      // Add verification and contact info
      ministry_contact: "Contact ministry for inquiries",
      instructions: "Arrive 15 minutes early with valid ID",
      system: "Nigerian Public Service Appointment System",
    }

    setQrCodeData(appointmentData)

    generateAdvancedQRCode(appointmentData)
      .then((url) => {
        setQrCodeUrl(url)
        setIsGeneratingQR(false)
      })
      .catch((error) => {
        console.error("QR generation failed:", error)
        setIsGeneratingQR(false)
      })
  }, [bookingData, user])

  const handleDownloadReceipt = () => {
    // Generate a comprehensive receipt with QR code
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Receipt - ${bookingData.appointmentId}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f8f9fa;
          }
          .receipt-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header { 
            text-align: center; 
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 30px 20px;
          }
          .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .receipt-title { font-size: 22px; margin: 10px 0; }
          .receipt-id { font-size: 14px; opacity: 0.9; }
          .content { 
            display: flex; 
            gap: 40px; 
            padding: 30px;
          }
          .details { flex: 1; }
          .qr-section { 
            text-align: center; 
            min-width: 250px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          .qr-code { 
            max-width: 200px; 
            height: 200px; 
            border: 3px solid #22c55e; 
            padding: 10px; 
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .detail-section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #22c55e;
          }
          .detail-row { 
            margin: 12px 0; 
            padding: 12px; 
            background: #f8f9fa; 
            border-radius: 6px;
            border-left: 4px solid #22c55e;
          }
          .label { 
            font-weight: 600; 
            color: #374151; 
            display: inline-block;
            min-width: 120px;
          }
          .value { 
            color: #1f2937; 
            font-weight: 500;
          }
          .status-badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb; 
            padding-top: 20px; 
          }
          .instructions { 
            background: #dbeafe; 
            border: 1px solid #93c5fd;
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
          }
          .instructions h3 {
            color: #1e40af;
            margin-top: 0;
          }
          .instructions ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .instructions li {
            margin: 8px 0;
            color: #1e40af;
          }
          .qr-instructions {
            background: #f0fdf4;
            border: 1px solid #86efac;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
          }
          .qr-instructions h4 {
            color: #166534;
            margin: 0 0 10px 0;
            font-size: 14px;
          }
          .qr-instructions p {
            color: #166534;
            margin: 5px 0;
            font-size: 12px;
          }
          @media print { 
            body { margin: 0; background: white; } 
            .receipt-container { box-shadow: none; }
          }
          @media (max-width: 768px) {
            .content { flex-direction: column; gap: 20px; }
            .qr-section { min-width: auto; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo">🇳🇬 Nigerian Public Service</div>
            <div class="receipt-title">OFFICIAL APPOINTMENT RECEIPT</div>
            <div class="receipt-id">Receipt #: ${bookingData.appointmentId}</div>
            <div>Federal Capital Territory, Abuja</div>
          </div>
          
          <div class="content">
            <div class="details">
              <div class="detail-section">
                <h3 class="section-title">📋 Appointment Information</h3>
                <div class="detail-row">
                  <span class="label">Appointment ID:</span>
                  <span class="value">${bookingData.appointmentId}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Queue Number:</span>
                  <span class="value">${bookingData.queueNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Ministry:</span>
                  <span class="value">${bookingData.ministry?.name}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Service:</span>
                  <span class="value">${bookingData.service?.name}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Location:</span>
                  <span class="value">${bookingData.location}, ${bookingData.state}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span class="value">${bookingData.date}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <span class="value">${bookingData.time}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span class="status-badge">Pending Confirmation</span>
                </div>
              </div>
              
              <div class="detail-section">
                <h3 class="section-title">👤 Citizen Details</h3>
                <div class="detail-row">
                  <span class="label">Full Name:</span>
                  <span class="value">${user.name}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">${user.email}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value">${user.phone}</span>
                </div>
              </div>
            </div>
            
            <div class="qr-section">
              <h3 class="section-title">📱 Quick Access</h3>
              <img src="${qrCodeUrl}" alt="Appointment QR Code" class="qr-code" />
              
              <div class="qr-instructions">
                <h4>🔍 How to Use QR Code:</h4>
                <p>• Scan with any QR code reader</p>
                <p>• Contains all appointment details</p>
                <p>• Show at ministry for quick check-in</p>
                <p>• Works offline once scanned</p>
              </div>
            </div>
          </div>
          
          <div class="instructions">
            <h3>📝 Important Instructions</h3>
            <ul>
              <li><strong>Arrive 15 minutes early</strong> - Allow time for security and check-in</li>
              <li><strong>Bring valid ID</strong> - National ID, Driver's License, or Passport</li>
              <li><strong>Required documents</strong> - Bring all documents mentioned during booking</li>
              <li><strong>QR Code or Receipt</strong> - Present this receipt or scan QR code at reception</li>
              <li><strong>Queue Number</strong> - Your number is <strong>${bookingData.queueNumber}</strong></li>
              <li><strong>Dress Code</strong> - Business casual or formal attire recommended</li>
            </ul>
          </div>
          
          <div class="footer">
            <p><strong>Nigerian Public Service Appointment System</strong></p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>This is an official appointment receipt. Please keep for your records.</p>
            <p>For inquiries: contact your respective ministry or visit our website</p>
            <p style="margin-top: 10px; font-weight: 600;">🔒 This receipt contains sensitive information. Keep secure.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([receiptHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `appointment-receipt-${bookingData.appointmentId}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const shareData = {
      title: "Appointment Booked Successfully",
      text: `✅ Appointment confirmed!\n\n🏛️ Ministry: ${bookingData.ministry?.name}\n📅 Date: ${bookingData.date}\n⏰ Time: ${bookingData.time}\n🎫 ID: ${bookingData.appointmentId}\n🔢 Queue: ${bookingData.queueNumber}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text)
      alert("Appointment details copied to clipboard!")
    }
  }

  const handleTestQRCode = () => {
    if (qrCodeData) {
      alert(`QR Code contains:\n\n${JSON.stringify(qrCodeData, null, 2)}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">{t("booking.success.title")}</h2>
        <p className="text-muted-foreground">{t("booking.success.subtitle")}</p>
      </div>

      {/* Appointment Summary with QR Code */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-center">{t("booking.success.appointmentBooked")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointment IDs */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{bookingData.appointmentId}</div>
                <p className="text-sm text-muted-foreground">{t("booking.appointmentId")}</p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{bookingData.queueNumber}</div>
                <p className="text-sm text-muted-foreground">{t("booking.queueNumber")}</p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{bookingData.service?.name}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.ministry?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{bookingData.location}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.state}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{bookingData.date}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.time}</p>
                </div>
              </div>

              <div className="pt-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {t("status.pending")}
                </Badge>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="text-center space-y-4">
              <div>
                <QrCode className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Smart QR Code</h3>
                <p className="text-sm text-muted-foreground">Contains all appointment details</p>
              </div>

              {isGeneratingQR ? (
                <div className="flex justify-center">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </div>
                </div>
              ) : qrCodeUrl ? (
                <div className="flex justify-center">
                  <div className="p-4 bg-white border-2 border-green-200 rounded-lg shadow-sm">
                    <img src={qrCodeUrl || "/placeholder.svg"} alt="Appointment QR Code" className="w-32 h-32" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">QR Code generation failed</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">📱 Scan with any QR reader for instant access</p>
                <Button size="sm" variant="outline" onClick={handleTestQRCode} className="text-xs">
                  <Smartphone className="h-3 w-3 mr-1" />
                  Test QR Data
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Details Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="mr-2 h-5 w-5 text-blue-600" />
            QR Code Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">📊 Data Included:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>✅ Appointment ID & Queue Number</li>
                <li>✅ Ministry & Service Details</li>
                <li>✅ Date, Time & Location</li>
                <li>✅ Your Personal Information</li>
                <li>✅ Current Status</li>
                <li>✅ Verification Timestamp</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📱 How to Use:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Open any QR scanner app</li>
                <li>• Point camera at QR code</li>
                <li>• View complete appointment details</li>
                <li>• Show to ministry staff for check-in</li>
                <li>• Works offline once scanned</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>{t("booking.success.nextSteps")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Download Your Receipt</p>
                <p className="text-sm text-muted-foreground">Save the official receipt with QR code for your records</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Save QR Code to Phone</p>
                <p className="text-sm text-muted-foreground">
                  Screenshot or save the QR code for quick access at the ministry
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">{t("booking.success.step3.title")}</p>
                <p className="text-sm text-muted-foreground">
                  Arrive 15 minutes early with valid ID and required documents
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownloadReceipt} className="bg-green-600 hover:bg-green-700">
          <Download className="mr-2 h-4 w-4" />
          Download Official Receipt
        </Button>

        <Button onClick={handleShare} variant="outline">
          <Share className="mr-2 h-4 w-4" />
          Share Appointment
        </Button>

        <Button asChild variant="outline">
          <Link href="/dashboard">
            <Calendar className="mr-2 h-4 w-4" />
            View Dashboard
          </Link>
        </Button>
      </div>

      {/* Additional Info */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold mb-2 text-amber-800">🔔 Important Reminder</h3>
            <p className="text-sm text-amber-700 mb-2">
              Your appointment is currently <strong>pending confirmation</strong>. You will receive an email
              notification once confirmed by the ministry.
            </p>
            <p className="text-sm font-medium text-amber-800">
              💡 Pro Tip: The QR code contains all your appointment details and works even without internet!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
