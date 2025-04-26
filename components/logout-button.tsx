"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would call your logout API here
    // For now, we'll just redirect to the login page
    router.push("/login")
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  )
}
