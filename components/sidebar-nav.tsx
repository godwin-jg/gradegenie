"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Users, Link2 } from "lucide-react"

const navigation = [
  { name: "Assignments", href: "/dashboard/assignments", icon: FileText },
  { name: "Classrooms", href: "/dashboard/classrooms", icon: Users },
  { name: "Integrations", href: "/dashboard/integrations", icon: Link2 },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
              isActive ? "bg-primary text-primary-foreground" : "transparent hover:bg-muted",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
