import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Google Classroom Integration | GradeGenie",
  description: "Connect GradeGenie with Google Classroom",
}

export default function GoogleClassroomIntegrationPage() {
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
        heading="Google Classroom Integration"
        subheading="Connect GradeGenie with Google Classroom to sync courses, assignments, and student data."
      />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Connection Setup</CardTitle>
              <CardDescription>
                Follow these steps to connect GradeGenie with your Google Classroom account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Google Workspace for Education account required</AlertTitle>
                <AlertDescription>
                  You'll need a Google Workspace for Education account to connect Google Classroom.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">What permissions will GradeGenie request?</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>• View and manage your Google Classroom classes</li>
                  <li>• View and manage course work and grades for students</li>
                  <li>• View your Google Classroom rosters</li>
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  GradeGenie only requests the permissions necessary to sync your courses, assignments, and grades.
                </p>
              </div>

              <Button className="w-full">Connect with Google Classroom</Button>

              <p className="text-xs text-muted-foreground">
                By connecting, you'll be redirected to Google to authorize GradeGenie's access to your Google Classroom
                data.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>What Gets Synced</CardTitle>
              <CardDescription>Here's what GradeGenie will sync with Google Classroom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SyncItem title="Classes" description="Import your Google Classroom classes into GradeGenie." />
              <SyncItem title="Students" description="Sync student roster information from Google Classroom." />
              <SyncItem
                title="Assignments"
                description="Import existing assignments or create new ones that sync back to Google Classroom."
              />
              <SyncItem title="Submissions" description="Access student submissions made through Google Classroom." />
              <SyncItem
                title="Grades & Feedback"
                description="Push grades and feedback from GradeGenie to Google Classroom."
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
