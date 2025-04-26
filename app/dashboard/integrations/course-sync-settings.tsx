"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type SyncSetting = {
  id: string
  name: string
  description: string
  enabled: boolean
  options?: {
    id: string
    name: string
    description: string
    value: string | boolean
  }[]
}

export function CourseSyncSettings() {
  const [settings, setSettings] = useState<SyncSetting[]>([
    {
      id: "courses",
      name: "Course Sync",
      description: "Import courses from your LMS",
      enabled: true,
    },
    {
      id: "students",
      name: "Student Roster Sync",
      description: "Import student information from your LMS",
      enabled: true,
    },
    {
      id: "assignments",
      name: "Assignment Sync",
      description: "Import and export assignments between GradeGenie and your LMS",
      enabled: true,
      options: [
        {
          id: "import_assignments",
          name: "Import Assignments",
          description: "Import assignments from your LMS to GradeGenie",
          value: true,
        },
        {
          id: "export_assignments",
          name: "Export Assignments",
          description: "Export assignments from GradeGenie to your LMS",
          value: true,
        },
      ],
    },
    {
      id: "submissions",
      name: "Submission Sync",
      description: "Import student submissions from your LMS",
      enabled: true,
    },
    {
      id: "grades",
      name: "Grade Sync",
      description: "Export grades and feedback from GradeGenie to your LMS",
      enabled: true,
      options: [
        {
          id: "sync_frequency",
          name: "Sync Frequency",
          description: "How often to sync grades with your LMS",
          value: "manual",
        },
      ],
    },
  ])

  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({})

  const toggleSetting = (id: string) => {
    setSettings(settings.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)))
  }

  const updateOption = (settingId: string, optionId: string, value: string | boolean) => {
    setSettings(
      settings.map((setting) =>
        setting.id === settingId
          ? {
              ...setting,
              options: setting.options?.map((option) => (option.id === optionId ? { ...option, value } : option)),
            }
          : setting,
      ),
    )
  }

  const toggleCollapsible = (id: string) => {
    setIsOpen({
      ...isOpen,
      [id]: !isOpen[id],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Settings</CardTitle>
        <CardDescription>Configure what data is synchronized between GradeGenie and your LMS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => (
          <Collapsible
            key={setting.id}
            open={isOpen[setting.id]}
            onOpenChange={() => toggleCollapsible(setting.id)}
            className="border rounded-lg"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Switch
                  id={`setting-${setting.id}`}
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSetting(setting.id)}
                />
                <div>
                  <Label htmlFor={`setting-${setting.id}`} className="text-base font-medium">
                    {setting.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
              </div>

              {setting.options && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen[setting.id] ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>

            {setting.options && (
              <CollapsibleContent>
                <div className="border-t p-4 space-y-4">
                  {setting.options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{option.name}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>

                      {typeof option.value === "boolean" ? (
                        <Checkbox
                          id={`option-${option.id}`}
                          checked={option.value}
                          onCheckedChange={(checked) => updateOption(setting.id, option.id, Boolean(checked))}
                          disabled={!setting.enabled}
                        />
                      ) : (
                        <Select
                          value={option.value as string}
                          onValueChange={(value) => updateOption(setting.id, option.id, value)}
                          disabled={!setting.enabled}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>
        ))}

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}
