import type React from "react"
import type { Metadata } from "next"
import { Inter, Onest } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

// Load Onest font for headings
const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
})

// Load Inter font for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "GradeGenie",
  description: "AI-powered grading assistant for educators",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${onest.variable} ${inter.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
