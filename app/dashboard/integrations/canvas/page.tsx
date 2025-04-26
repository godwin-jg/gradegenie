import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Canvas Integration | GradeGenie",
  description: "Connect GradeGenie with Canvas",
}

export default function CanvasIntegrationPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link
          href="/dashboard/integrations"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Integrations
        </Link>
      </div>

      <PageHeader
        heading="Canvas Integration"
        subheading="Connect GradeGenie with Canvas to sync courses, assignments, and grades."
      />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Connection Setup</CardTitle>
              <CardDescription>Follow these steps to connect GradeGenie with your Canvas instance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="automatic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="automatic">Automatic Setup</TabsTrigger>
                  <TabsTrigger value="manual">Manual Setup</TabsTrigger>
                </TabsList>
                <TabsContent value="automatic" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="canvas-url">Canvas Instance URL</Label>
                      <Input id="canvas-url" placeholder="https://your-institution.instructure.com" />
                      <p className="text-xs text-muted-foreground">Enter the URL of your Canvas instance</p>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Administrator privileges required</AlertTitle>
                      <AlertDescription>
                        You'll need to log in with an account that has administrator privileges in Canvas.
                      </AlertDescription>
                    </Alert>

                    <Button className="w-full">Connect to Canvas</Button>

                    <p className="text-xs text-muted-foreground">
                      By connecting, you'll be redirected to Canvas to authorize GradeGenie's access to your courses,
                      assignments, and grades.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="manual" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Step 1: Create a Developer Key in Canvas</h3>
                      <ol className="mt-2 space-y-2 text-sm">
                        <li>1. Log in to Canvas as an administrator</li>
                        <li>2. Go to Admin → Developer Keys → + Developer Key</li>
                        <li>
                          3. Create a new key with the following redirect URI:
                          <code className="ml-2 rounded bg-muted px-2 py-1">
                            https://app.gradegenie.ai/api/auth/callback/canvas
                          </code>
                        </li>
                        <li>4. Copy the Client ID and Client Secret</li>
                      </ol>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link
                          href="https://community.canvaslms.com/t5/Admin-Guide/How-do-I-manage-developer-keys-for-an-account/ta-p/259"
                          target="_blank"
                        >
                          Canvas Documentation
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="canvas-url-manual">Canvas Instance URL</Label>
                      <Input id="canvas-url-manual" placeholder="https://your-institution.instructure.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-id">Client ID</Label>
                      <Input id="client-id" placeholder="10000000000001" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-secret">Client Secret</Label>
                      <Input id="client-secret" type="password" placeholder="••••••••••••••••••••••••" />
                    </div>

                    <Button className="w-full">Save Connection</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>What Gets Synced</CardTitle>
              <CardDescription>Here's what GradeGenie will sync with Canvas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SyncItem
                title="Courses & Sections"
                description="Import your Canvas courses and sections into GradeGenie."
              />
              <SyncItem title="Students" description="Sync student roster information from Canvas." />
              <SyncItem
                title="Assignments"
                description="Import existing assignments or create new ones that sync back to Canvas."
              />
              <SyncItem title="Submissions" description="Access student submissions made through Canvas." />
              <SyncItem
                title="Grades & Feedback"
                description="Push grades and feedback from GradeGenie to Canvas gradebook."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SyncItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Separator className="mt-2" />
    </div>
  )
}
