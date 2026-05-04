import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PreCode",
  description: "Spec before code",
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
