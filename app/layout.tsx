import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PreCode - Think Before You Code",
  description:
    "An AI-powered educational platform that enforces a structured workflow: plan your logic, specify behavior, and think before you type.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
