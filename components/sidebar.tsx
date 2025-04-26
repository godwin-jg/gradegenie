"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, LogOut, MessageSquare, Settings, Users } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">GradeGenie</h2>
          <div className="space-y-1">
            <Button variant="secondary" size="sm" className="w-full justify-start" asChild>
              <Link href="/dashboard/assignments">
                <FileText className="mr-2 h-4 w-4" />
                Assignments
              </Link>
            </Button>
            <Button
              variant={pathname?.includes("/dashboard/courses") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Courses
              </Link>
            </Button>
            <Button
              variant={pathname?.includes("/dashboard/classroom") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/classroom">
                <Users className="mr-2 h-4 w-4" />
                Classroom
              </Link>
            </Button>
            <Button
              variant={pathname?.includes("/dashboard/integrations") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/integrations">
                <Settings className="mr-2 h-4 w-4" />
                Integrations
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Support</h2>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <a href="https://gradegenie.hipporello.net/desk" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" />
                Feedback
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
