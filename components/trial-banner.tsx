"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"
import Link from "next/link"

interface TrialBannerProps {
  trialEndDate: string // ISO date string
  remainingCredits: number
}

export function TrialBanner({ trialEndDate, remainingCredits }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(0)

  useEffect(() => {
    const endDate = new Date(trialEndDate)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setDaysRemaining(diffDays > 0 ? diffDays : 0)

    // Update daily
    const interval = setInterval(
      () => {
        const now = new Date()
        const diffTime = endDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setDaysRemaining(diffDays > 0 ? diffDays : 0)
      },
      1000 * 60 * 60 * 24,
    )

    return () => clearInterval(interval)
  }, [trialEndDate])

  if (dismissed) return null

  return (
    <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>
          You're on a free trial. {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining.
          {remainingCredits > 0
            ? ` ${remainingCredits} grading ${remainingCredits === 1 ? "credit" : "credits"} left.`
            : ""}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/upgrade">Upgrade Now</Link>
        </Button>
        <button onClick={() => setDismissed(true)} className="text-primary-foreground/80 hover:text-primary-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
