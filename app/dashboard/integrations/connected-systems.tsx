"use client"

import { useState } from "react"
import { Check, RefreshCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ConnectedSystem = {
  id: string
  name: string
  type: "canvas" | "google-classroom" | "moodle"
  status: "active" | "error" | "syncing"
  lastSync: string
  autoSync: boolean
  courses: number
  students: number
}

export function ConnectedSystems() {
  const [systems, setSystems] = useState<ConnectedSystem[]>([
    {
      id: "1",
      name: "My Canvas Instance",
      type: "canvas",
      status: "active",
      lastSync: "2023-06-15T14:30:00Z",
      autoSync: true,
      courses: 5,
      students: 127,
    },
  ])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [systemToRemove, setSystemToRemove] = useState<string | null>(null)

  const handleAutoSyncToggle = (id: string) => {
    setSystems(systems.map((system) => (system.id === id ? { ...system, autoSync: !system.autoSync } : system)))
  }

  const handleSync = (id: string) => {
    setSystems(systems.map((system) => (system.id === id ? { ...system, status: "syncing" } : system)))

    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      setSystems(
        systems.map((system) =>
          system.id === id
            ? {
                ...system,
                status: "active",
                lastSync: new Date().toISOString(),
              }
            : system,
        ),
      )
    }, 2000)
  }

  const openConfirmDialog = (id: string) => {
    setSystemToRemove(id)
    setIsConfirmOpen(true)
  }

  const handleRemove = () => {
    if (systemToRemove) {
      setSystems(systems.filter((system) => system.id !== systemToRemove))
      setSystemToRemove(null)
    }
    setIsConfirmOpen(false)
  }

  if (systems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="text-lg font-medium">No connected systems yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect to a Learning Management System to sync your courses, assignments, and grades.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {systems.map((system) => (
          <Card key={system.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{system.name}</CardTitle>
                <StatusBadge status={system.status} />
              </div>
              <CardDescription>
                {system.type === "canvas" && "Canvas LMS"}
                {system.type === "google-classroom" && "Google Classroom"}
                {system.type === "moodle" && "Moodle"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Courses</p>
                  <p className="font-medium">{system.courses}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Students</p>
                  <p className="font-medium">{system.students}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Sync</p>
                  <p className="font-medium">
                    {new Date(system.lastSync).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Auto Sync</p>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`auto-sync-${system.id}`}
                      checked={system.autoSync}
                      onCheckedChange={() => handleAutoSyncToggle(system.id)}
                    />
                    <Label htmlFor={`auto-sync-${system.id}`} className="sr-only">
                      Auto Sync
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSync(system.id)}
                disabled={system.status === "syncing"}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${system.status === "syncing" ? "animate-spin" : ""}`} />
                {system.status === "syncing" ? "Syncing..." : "Sync Now"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => openConfirmDialog(system.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect the integration and remove all synced data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground">
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function StatusBadge({ status }: { status: "active" | "error" | "syncing" }) {
  if (status === "active") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
        <Check className="mr-1 h-3 w-3" /> Connected
      </Badge>
    )
  }

  if (status === "error") {
    return <Badge variant="destructive">Error</Badge>
  }

  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
      <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Syncing
    </Badge>
  )
}
