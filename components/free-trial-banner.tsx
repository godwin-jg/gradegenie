"use client"

import { Button } from "@/components/ui/button"

export function FreeTrialBanner({
  daysRemaining,
  hoursRemaining,
  creditsRemaining,
}: {
  daysRemaining: number
  hoursRemaining: number
  creditsRemaining: number
}) {
  return (
    <>
      <div className="w-full bg-primary px-4 py-1 text-center text-primary-foreground">
        <div className="container flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="font-medium">Your educator trial is active:</span>
          <span>
            {daysRemaining}d {hoursRemaining}h remaining • {creditsRemaining} of 30 grading credits available
          </span>
          <Button
            variant="secondary"
            size="sm"
            className="h-6 px-2 text-xs font-medium"
            onClick={() => {
              window.location.href = "/pricing"
            }}
          >
            Upgrade Your Plan
          </Button>
        </div>
      </div>
    </>
  )
}
