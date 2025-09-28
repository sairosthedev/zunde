import { CheckInScanner } from "@/components/checkin-scanner"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, QrCode, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ScannerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <QrCode className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              QR Code Scanner
            </h1>
            <p className="text-muted-foreground">
              Staff tool for scanning participant QR codes and managing check-ins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Check-in</CardTitle>
                <CardDescription>Scan QR codes to check participants in</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Verify</CardTitle>
                <CardDescription>Verify participant details and event registration</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <QrCode className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Track</CardTitle>
                <CardDescription>Track attendance and bus assignments</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <CheckInScanner />
        </div>
      </main>
    </div>
  )
}
