"use client"

import { toast } from "@/components/ui/toast"
export { toast }

export function useToast() {
  return {
    toast,
  }
}
