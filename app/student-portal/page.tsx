import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, FileText, MessageSquare, Upload } from "lucide-react"

export default function StudentDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Submit Assignment
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Spring Semester 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">3 due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8</div>
            <p className="text-xs text-muted-foreground">+0.2 from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Tutor Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Assignments due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center">
                  <div className="mr-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{deadline.title}</p>
                    <p className="text-sm text-muted-foreground">{deadline.course}</p>
                  </div>
                  <div className="ml-auto font-medium">{deadline.dueDate}</div>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Your progress in current courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseProgress.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.completed} of {course.total} assignments completed
                      </p>
                    </div>
                    <p className="text-sm font-medium">{course.grade}</p>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>Latest feedback from your instructors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{feedback.assignment}</p>
                    <p className="text-sm font-medium">{feedback.grade}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{feedback.course}</p>
                  <p className="text-sm">{feedback.comment}</p>
                  <Button variant="link" size="sm" className="px-0">
                    View Full Feedback
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Tutor</CardTitle>
            <CardDescription>Get help with your assignments and coursework</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium">Ask a Question</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your AI tutor can help with course concepts, assignment clarification, and study tips.
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with AI Tutor
                </Button>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium">Pre-Submission Feedback</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Get AI feedback on your draft before final submission.
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Draft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const upcomingDeadlines = [
  {
    id: "1",
    title: "Research Paper",
    course: "Introduction to Psychology",
    dueDate: "Tomorrow",
  },
  {
    id: "2",
    title: "Problem Set 3",
    course: "Advanced Statistics",
    dueDate: "2 days",
  },
  {
    id: "3",
    title: "Group Project",
    course: "Environmental Science",
    dueDate: "4 days",
  },
  {
    id: "4",
    title: "Short Story",
    course: "Creative Writing",
    dueDate: "7 days",
  },
]

const courseProgress = [
  {
    id: "1",
    title: "Introduction to Psychology",
    completed: 5,
    total: 8,
    progress: 62.5,
    grade: "A-",
  },
  {
    id: "2",
    title: "Advanced Statistics",
    completed: 9,
    total: 12,
    progress: 75,
    grade: "B+",
  },
  {
    id: "3",
    title: "Environmental Science",
    completed: 4,
    total: 6,
    progress: 66.7,
    grade: "A",
  },
  {
    id: "4",
    title: "Creative Writing",
    completed: 8,
    total: 10,
    progress: 80,
    grade: "A-",
  },
]

const recentFeedback = [
  {
    id: "1",
    assignment: "Midterm Exam",
    course: "Introduction to Psychology",
    grade: "A (92%)",
    comment:
      "Excellent work! Your analysis of cognitive biases was particularly insightful. Consider exploring the practical applications of these concepts in your future work.",
  },
  {
    id: "2",
    assignment: "Problem Set 2",
    course: "Advanced Statistics",
    grade: "B+ (88%)",
    comment:
      "Good job on the regression analysis. Your interpretation of the results could be more detailed. Make sure to explain the practical significance of your findings.",
  },
  {
    id: "3",
    assignment: "Essay 1",
    course: "Creative Writing",
    grade: "A- (90%)",
    comment:
      "Your narrative voice is developing nicely. Pay attention to pacing in the middle section, and consider how dialogue can reveal character more effectively.",
  },
]
