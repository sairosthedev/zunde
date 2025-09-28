import { Header } from "@/components/header"
import { ParticipantNav } from "@/components/participant-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, QrCode } from "lucide-react"
import Link from "next/link"

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">My Event Tickets</h1>
            <p className="text-lg text-muted-foreground">View and manage your registered event tickets</p>
          </div>

          <ParticipantNav />

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Your registered events and digital tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tickets found. Register for an event to see your tickets here.</p>
                  <Link href="/participant">
                    <Button className="mt-4">Register for Event</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
