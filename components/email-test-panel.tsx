"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function EmailTestPanel() {
  const [emailLogs, setEmailLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const loadEmailLogs = () => {
    const logs = JSON.parse(localStorage.getItem("email_logs") || "[]")
    setEmailLogs(logs.reverse()) // Show newest first
  }

  const testEmail = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          type: "test",
        }),
      })

      const result = await response.json()
      console.log("Test email result:", result)

      // Refresh logs after test
      setTimeout(loadEmailLogs, 1000)
    } catch (error) {
      console.error("Test email failed:", error)
    }
    setLoading(false)
  }

  const clearLogs = () => {
    localStorage.removeItem("email_logs")
    setEmailLogs([])
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notification Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testEmail} disabled={loading || !user}>
              {loading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              Send Test Email
            </Button>
            <Button variant="outline" onClick={loadEmailLogs}>
              <Eye className="mr-2 h-4 w-4" />
              Load Email Logs
            </Button>
            <Button variant="outline" onClick={clearLogs}>
              Clear Logs
            </Button>
          </div>

          {!user && <p className="text-sm text-muted-foreground">Please log in to test email notifications</p>}
        </CardContent>
      </Card>

      {emailLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Email Logs ({emailLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emailLogs.map((log, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {log.messageId ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-orange-500" />
                      )}
                      <span className="font-medium">{log.subject}</span>
                    </div>
                    <Badge variant={log.messageId ? "default" : "secondary"}>
                      {log.messageId ? "Sent" : "Fallback"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>To:</strong> {log.to}
                    </p>
                    <p>
                      <strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}
                    </p>
                    {log.error && (
                      <p>
                        <strong>Error:</strong> {log.error}
                      </p>
                    )}
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">Preview</summary>
                    <div className="mt-2 p-2 bg-muted rounded text-xs">{log.htmlPreview}</div>
                  </details>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
