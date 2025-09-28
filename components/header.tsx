"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const pathname = usePathname()

  const getPortalInfo = () => {
    if (pathname.startsWith("/admin")) {
      return { name: "Admin Portal", color: "secondary" }
    }
    if (pathname.startsWith("/checkin")) {
      return { name: "Check-in Portal", color: "outline" }
    }
    if (pathname.startsWith("/participant")) {
      return { name: "Participant Portal", color: "default" }
    }
    return null
  }

  const portalInfo = getPortalInfo()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 relative">
              <Image
                src="/images/uz-sda-logo.png"
                alt="UZ SDA Students' Association"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">UZ SDA Students' Association</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Event Management System</span>
                {portalInfo && (
                  <Badge variant={portalInfo.color as any} className="text-xs">
                    {portalInfo.name}
                  </Badge>
                )}
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {/* Navigation items removed as requested */}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Admin Login button removed as requested */}
          </div>
        </div>
      </div>
    </header>
  )
}
