"use client"

import type { ReactNode } from "react"

interface UpgradeDialogProps {
  children: ReactNode
}

export function UpgradeDialog({ children }: UpgradeDialogProps) {
  // Simply render the children directly without the paywall dialog
  return <>{children}</>
}
