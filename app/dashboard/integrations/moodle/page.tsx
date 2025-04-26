import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Moodle Integration | GradeGenie",
  description: "Connect GradeGenie with Moodle",
}

export default function MoodleIntegrationPage() {
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
        heading="Moodle Integration"
        subheading="Connect GradeGenie with Moodle to sync courses, assignments, and grades."
      />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Connection Setup</CardTitle>
              <CardDescription>Follow these steps to connect GradeGenie with your Moodle instance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Administrator access required</AlertTitle>
                <AlertDescription>
                  You'll need administrator access to your Moodle instance to complete this setup.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Step 1: Enable Web Services in Moodle</h3>
                <ol className="mt-2 space-y-2 text-sm">
                  <li>1. Log in to Moodle as an administrator</li>
                  <li>2. Go to Site administration → Plugins → Web services → Overview</li>
                  <li>3. Follow the steps to enable web services</li>
                  <li>4. Create a new external service for GradeGenie</li>
                </ol>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="https://docs.moodle.org/311/en/Using_web_services" target="_blank">
                    Moodle Documentation
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="moodle-url">Moodle Site URL</Label>
                <Input id="moodle-url" placeholder="https://your-moodle-site.edu" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Web Services Token</Label>
                <Input id="token" placeholder="Your Moodle web services token" />
                <p className="text-xs text-muted-foreground">
                  Create a token in Moodle: Site administration → Plugins → Web services → Manage tokens
                </p>
              </div>

              <Button className="w-full">Connect to Moodle</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>What Gets Synced</CardTitle>
              <CardDescription>Here's what GradeGenie will sync with Moodle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SyncItem title="Courses" description="Import your Moodle courses into GradeGenie." />
              <SyncItem title="Students" description="Sync student roster information from Moodle." />
              <SyncItem
                title="Assignments"
                description="Import existing assignments or create new ones that sync back to Moodle."
              />
              <SyncItem title="Submissions" description="Access student submissions made through Moodle." />
              <SyncItem
                title="Grades & Feedback"
                description="Push grades and feedback from GradeGenie to Moodle gradebook."
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
