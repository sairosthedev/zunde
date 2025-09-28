import { EventRegistration } from "@/components/event-registration"
import { Header } from "@/components/header"
import { ParticipantNav } from "@/components/participant-nav"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ParticipantPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Event Registration
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Register for Zunde outreach preaching events and receive your QR-coded e-ticket for easy check-in.
            </p>
          </div>

          <ParticipantNav />
          <EventRegistration />
        </div>
      </main>
    </div>
  )
}
