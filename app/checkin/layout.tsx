import type { ReactNode } from "react"

export default function CheckinLayout({
  children,
}: {
  children: ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
