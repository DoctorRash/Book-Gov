// QR Code generation utility using a simple canvas-based approach
export async function generateQRCode(data: any): Promise<string> {
  try {
    // Convert appointment data to JSON string
    const qrData = JSON.stringify(data, null, 2)

    // For development, we'll use a QR code API service
    // In production, you might want to use a proper QR library
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`

    // Return the QR code image URL
    return qrApiUrl
  } catch (error) {
    console.error("Error generating QR code:", error)

    // Fallback: create a simple data URL with appointment info
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (ctx) {
      canvas.width = 200
      canvas.height = 200

      // Simple placeholder QR code design
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 200, 200)

      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"

      // Draw appointment info as text (fallback)
      const lines = [
        `ID: ${data.id}`,
        `Queue: ${data.queueNumber}`,
        `Date: ${data.date}`,
        `Time: ${data.time}`,
        `Ministry: ${data.ministry?.substring(0, 15)}...`,
      ]

      lines.forEach((line, index) => {
        ctx.fillText(line, 100, 40 + index * 20)
      })

      // Add border
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      ctx.strokeRect(10, 10, 180, 180)

      return canvas.toDataURL()
    }

    // Ultimate fallback
    return "/placeholder.svg?height=200&width=200"
  }
}

// Alternative QR code generator using QRCode.js library
export async function generateAdvancedQRCode(data: any): Promise<string> {
  return new Promise((resolve) => {
    try {
      // Create canvas element
      const canvas = document.createElement("canvas")
      const size = 200

      // QR code data
      const qrData = {
        appointmentId: data.id,
        queueNumber: data.queueNumber,
        ministry: data.ministry,
        service: data.service,
        location: data.location,
        date: data.date,
        time: data.time,
        citizen: data.citizen,
        status: data.status,
        timestamp: data.createdAt,
        // Add verification URL
        verifyUrl: `${window.location.origin}/verify-appointment/${data.id}`,
      }

      const jsonData = JSON.stringify(qrData)

      // Use QR Server API for reliable QR code generation
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&format=png&data=${encodeURIComponent(jsonData)}`

      // Verify the QR code loads properly
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Draw white background
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, size, size)

          // Draw QR code
          ctx.drawImage(img, 0, 0, size, size)

          // Add border
          ctx.strokeStyle = "#22c55e"
          ctx.lineWidth = 4
          ctx.strokeRect(2, 2, size - 4, size - 4)

          resolve(canvas.toDataURL("image/png"))
        } else {
          resolve(qrUrl)
        }
      }

      img.onerror = () => {
        // Fallback to direct URL
        resolve(qrUrl)
      }

      img.src = qrUrl
    } catch (error) {
      console.error("Advanced QR generation error:", error)
      // Fallback to simple API
      const simpleQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`
      resolve(simpleQrUrl)
    }
  })
}

// QR Code data parser for verification
export function parseQRCodeData(qrString: string) {
  try {
    const data = JSON.parse(qrString)
    return {
      isValid: true,
      appointmentId: data.appointmentId,
      queueNumber: data.queueNumber,
      ministry: data.ministry,
      service: data.service,
      location: data.location,
      date: data.date,
      time: data.time,
      citizen: data.citizen,
      status: data.status,
      timestamp: data.timestamp,
      verifyUrl: data.verifyUrl,
    }
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid QR code data",
    }
  }
}
