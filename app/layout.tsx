import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const instrumentSerif = Instrument_Serif({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-serif",
  style: ['normal', 'italic'] 
})

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
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased bg-stone-50 text-stone-900">{children}</body>
    </html>
  )
}
