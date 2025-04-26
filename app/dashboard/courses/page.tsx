import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CoursesPage() {
  // Mock courses data
  const courses = [
    {
      id: "1",
      name: "Introduction to Literature",
      description: "A survey of major literary works from various periods and cultures.",
      subject: "English",
      students: 28,
      assignments: 12,
    },
    {
      id: "2",
      name: "Algebra II",
      description: "Advanced algebraic concepts including functions, equations, and graphs.",
      subject: "Mathematics",
      students: 32,
      assignments: 15,
    },
    {
      id: "3",
      name: "World History",
      description: "Exploration of major historical events and their impact on modern society.",
      subject: "History",
      students: 25,
      assignments: 8,
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <PageHeader heading="Courses" subheading="Manage your courses and create new ones" />
        <Button asChild>
          <Link href="/dashboard/courses/create" title="Create a new course with details and AI-generated syllabus">
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{course.students}</span> Students
                </div>
                <div>
                  <span className="font-medium">{course.assignments}</span> Assignments
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild className="w-full">
                <Link href={`/dashboard/courses/${course.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
