import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ConnectedSystems } from "./connected-systems"

export const metadata: Metadata = {
  title: "LMS Integrations | GradeGenie",
  description: "Connect GradeGenie with your Learning Management System",
}

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading="LMS Integrations"
        subheading="Connect GradeGenie with your Learning Management System to sync courses, assignments, and grades."
      />

      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Connected Systems</h2>
        <ConnectedSystems />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Available Integrations</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <LmsCard
            name="Canva"
            logo="/canva-logo.svg"
            description="Connect to Canva to sync presentations."
            setupUrl="/dashboard/integrations/canvas"
          />
          {/* <LmsCard
            name="Google Classroom"
            logo="/images/google-classroom-logo.svg"
            description="Connect to Google Classroom to sync courses, assignments, and student data."
            setupUrl="/dashboard/integrations/google-classroom"
          /> */}
          {/* <LmsCard
            name="Moodle"
            logo="/images/moodle-logo.svg"
            description="Connect to Moodle to sync courses, assignments, and grades."
            setupUrl="/dashboard/integrations/moodle"
          /> */}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Why Connect Your LMS?</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <BenefitCard
            title="Seamless Grade Syncing"
            description="Push grades and feedback from GradeGenie directly to your LMS gradebook."
          />
          <BenefitCard
            title="Import Existing Courses"
            description="Automatically import your courses, students, and assignments from your LMS."
          />
          <BenefitCard
            title="Streamlined Workflow"
            description="Students submit through your LMS, you grade with GradeGenie, and feedback appears in your LMS."
          />
        </div>
      </div>
    </div>
  )
}

function LmsCard({
  name,
  logo,
  description,
  setupUrl,
}: {
  name: string
  logo: string
  description: string
  setupUrl: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="h-12 w-12 overflow-hidden rounded-md">
          <Image
            src={logo || "/placeholder.svg"}
            alt={`${name} logo`}
            width={48}
            height={48}
            className="h-full w-full object-contain"
          />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="min-h-[60px]">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={setupUrl}>
            Set Up Connection <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <CheckCircle2 className="h-10 w-10 text-primary" />
      <h3 className="mt-4 text-xl font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
