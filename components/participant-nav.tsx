"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Ticket, User } from "lucide-react"

export function ParticipantNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/participant",
      label: "Register for Events",
      icon: Calendar,
      description: "Browse and register for upcoming events",
    },
    {
      href: "/participant/tickets",
      label: "My Tickets",
      icon: Ticket,
      description: "View and manage your event tickets",
    },
    {
      href: "/participant/profile",
      label: "My Profile",
      icon: User,
      description: "Update your registration information",
    },
  ]

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "outline"}
                  className="w-full h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-80">{item.description}</div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
