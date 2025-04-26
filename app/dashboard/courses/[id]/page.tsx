"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, GraduationCap, Loader2, Plus, Save, Users, Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("assignments")
  const [isDownloadingSyllabus, setIsDownloadingSyllabus] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  // Find the course by ID
  const course = courses.find((c) => c.id === params.id) || courses[0]

  const handleGradeAssignment = (assignmentId: string) => {
    toast({
      title: "Opening grading interface",
      description: "Loading assignment submissions",
    })
    // In a real app, this would navigate to the grading page for this assignment
    window.location.href = `/dashboard/assignments/${assignmentId}`
  }

  const handleEmailStudents = () => {
    setIsEmailModalOpen(true)
  }

  const handleSendEmail = () => {
    toast({
      title: "Email Sent",
      description: "Your email has been sent to all students in this course",
    })
    setIsEmailModalOpen(false)
  }

  const handleDownloadRoster = () => {
    toast({
      title: "Downloading roster",
      description: "Student roster CSV is being prepared for download",
    })
  }

  const handleDownloadSyllabusPDF = () => {
    setIsDownloadingSyllabus(true)

    // Simulate PDF download
    setTimeout(() => {
      setIsDownloadingSyllabus(false)

      toast({
        title: "Syllabus Downloaded",
        description: "Your syllabus has been downloaded as a PDF",
      })

      // In a real app, this would trigger a PDF download
    }, 2000)
  }

  const handleSyncWithLMS = (lms: string) => {
    setIsSyncing(true)

    // Simulate syncing with LMS
    setTimeout(() => {
      setIsSyncing(false)

      toast({
        title: "Sync Complete",
        description: `Course has been synced with ${lms}`,
      })
    }, 2000)
  }

  const handleUploadReference = () => {
    setIsUploadModalOpen(true)
  }

  const handleAddLink = () => {
    setIsLinkModalOpen(true)
  }

  const handleLinkSubmit = () => {
    toast({
      title: "Link Added",
      description: "Your reference link has been added to the course",
    })
    setIsLinkModalOpen(false)
  }

  const handleUploadSubmit = () => {
    toast({
      title: "Reference Uploaded",
      description: "Your reference material has been added to the course",
    })
    setIsUploadModalOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{course.title}</h2>
        <Badge>{course.code}</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>{course.students} students enrolled • Spring 2025</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/dashboard/create-assignment?courseId=${params.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Assignment
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="assignments" className="space-y-4" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
                <TabsTrigger value="references">Grading References</TabsTrigger>
              </TabsList>
              <TabsContent value="assignments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Assignments</CardTitle>
                    <CardDescription>Manage and grade assignments for this course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submissions</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courseAssignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>{assignment.dueDate}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  assignment.status === "Active"
                                    ? "default"
                                    : assignment.status === "Draft"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {assignment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{assignment.submissions}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleGradeAssignment(assignment.id)}>
                                Grade
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Enrolled Students</CardTitle>
                        <CardDescription>{course.students} students in this course</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleEmailStudents}>
                          Email All
                        </Button>
                        <Button variant="outline" onClick={handleDownloadRoster}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Roster
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Assignments Completed</TableHead>
                          <TableHead>Current Grade</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courseStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.completed}</TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="syllabus" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Course Syllabus</CardTitle>
                        <CardDescription>Review and edit your course syllabus</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleDownloadSyllabusPDF} disabled={isDownloadingSyllabus}>
                          {isDownloadingSyllabus ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </>
                          )}
                        </Button>
                        <Button asChild>
                          <Link href="/dashboard/create-syllabus">
                            <Save className="mr-2 h-4 w-4" />
                            Edit Syllabus
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none dark:prose-invert">
                      <h1>
                        {course.title} ({course.code})
                      </h1>
                      <h2>Spring 2025</h2>

                      <h3>Course Description</h3>
                      <p>
                        This course provides a comprehensive introduction to the scientific study of behavior and mental
                        processes. Students will explore the major theories, concepts, and research methods in
                        psychology, including biological bases of behavior, sensation and perception, learning, memory,
                        cognition, development, personality, social psychology, and psychological disorders.
                      </p>

                      <h3>Learning Objectives</h3>
                      <ul>
                        <li>Describe key concepts, principles, and overarching themes in psychology</li>
                        <li>Develop a working knowledge of psychology's content domains</li>
                        <li>Apply critical thinking skills to evaluate psychological research</li>
                        <li>Apply psychological concepts to real-world situations</li>
                        <li>Demonstrate effective written and oral communication skills</li>
                      </ul>

                      <h3>Required Materials</h3>
                      <ul>
                        <li>Myers, D. G., & DeWall, C. N. (2024). Psychology (14th ed.). Worth Publishers.</li>
                        <li>Additional readings will be provided on the course website</li>
                      </ul>

                      <h3>Assignments and Grading</h3>
                      <ul>
                        <li>Midterm Exam: 25%</li>
                        <li>Final Exam: 30%</li>
                        <li>Research Paper: 20%</li>
                        <li>Weekly Quizzes: 15%</li>
                        <li>Class Participation: 10%</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="references" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Grading References</CardTitle>
                        <CardDescription>
                          Upload links, documents, or text to use as references when grading
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleAddLink}>
                          <Link2 className="mr-2 h-4 w-4" />
                          Add Link
                        </Button>
                        <Button onClick={handleUploadReference}>
                          <Plus className="mr-2 h-4 w-4" />
                          Upload Reference
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All References</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="links">Links</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Added</TableHead>
                              <TableHead>Used In</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {gradingReferences.map((reference) => (
                              <TableRow key={reference.id}>
                                <TableCell className="font-medium">{reference.title}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      reference.type === "Document"
                                        ? "default"
                                        : reference.type === "Link"
                                          ? "outline"
                                          : "secondary"
                                    }
                                  >
                                    {reference.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>{reference.added}</TableCell>
                                <TableCell>{reference.usedIn}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>

                      <TabsContent value="documents" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {gradingReferences
                            .filter((ref) => ref.type === "Document")
                            .map((reference) => (
                              <Card key={reference.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-4">
                                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-medium">{reference.title}</h3>
                                      <p className="text-sm text-muted-foreground">Added {reference.added}</p>
                                      <p className="text-sm mt-1">Used in {reference.usedIn}</p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="links" className="space-y-4">
                        <div className="space-y-4">
                          {gradingReferences
                            .filter((ref) => ref.type === "Link")
                            .map((reference) => (
                              <div
                                key={reference.id}
                                className="flex items-center justify-between p-4 border rounded-md"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                                    <Link2 className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{reference.title}</h3>
                                    <p className="text-sm text-muted-foreground">{reference.url}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={reference.url} target="_blank" rel="noopener noreferrer">
                                      Open
                                    </a>
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    Copy
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>LMS Integrations</CardTitle>
                    <CardDescription>Connect this course with your Learning Management Systems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {lmsIntegrations.map((lms) => (
                        <div
                          key={lms.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded bg-primary/10">
                              {lms.icon}
                            </div>
                            <div>
                              <p className="font-medium">{lms.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {lms.connected
                                  ? "Connected - Course is synced"
                                  : "Not connected - Connect to sync course content"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {lms.connected ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => handleSyncWithLMS(lms.name)}
                                  disabled={isSyncing}
                                >
                                  {isSyncing ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Syncing...
                                    </>
                                  ) : (
                                    <>
                                      <Link2 className="mr-2 h-4 w-4" />
                                      Sync Now
                                    </>
                                  )}
                                </Button>
                                <Button variant="outline" size="sm" className="h-8">
                                  View in {lms.name}
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="default"
                                size="sm"
                                className="h-8"
                                onClick={() => (window.location.href = "/dashboard/integrations")}
                              >
                                <Link2 className="mr-2 h-4 w-4" />
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => (window.location.href = "/dashboard/integrations")}
                      >
                        Manage All Integrations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard/create-assignment">
                <FileText className="mr-2 h-4 w-4" />
                Create Assignment
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard/create-syllabus">
                <GraduationCap className="mr-2 h-4 w-4" />
                Edit Syllabus
              </Link>
            </Button>
            <Button className="w-full justify-start" onClick={handleEmailStudents}>
              <Users className="mr-2 h-4 w-4" />
              Email Students
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={handleDownloadRoster}>
              <Download className="mr-2 h-4 w-4" />
              Download Roster
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/integrations">
                <Link2 className="mr-2 h-4 w-4" />
                Manage Integrations
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      {activeTab === "assignments" && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Assignment Analytics</CardTitle>
            <CardDescription>Performance metrics across all assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Assignment performance chart will appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Reference Material</DialogTitle>
            <DialogDescription>
              Upload documents or text to use as grading references for this course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" placeholder="APA Style Guide" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input id="file" type="file" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" placeholder="Optional description" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Reference Link</DialogTitle>
            <DialogDescription>Add a web link to use as a grading reference for this course.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-title" className="text-right">
                Title
              </Label>
              <Input id="link-title" placeholder="Purdue OWL Writing Resources" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-url" className="text-right">
                URL
              </Label>
              <Input id="link-url" type="url" placeholder="https://example.com/resource" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-description" className="text-right">
                Description
              </Label>
              <Input id="link-description" placeholder="Optional description" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkSubmit}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Email All Students</DialogTitle>
            <DialogDescription>
              Send an email to all {course.students} students enrolled in this course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-subject" className="text-right">
                Subject
              </Label>
              <Input id="email-subject" placeholder="Important course announcement" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-body" className="text-right">
                Message
              </Label>
              <textarea
                id="email-body"
                placeholder="Enter your message here..."
                className="col-span-3 min-h-[150px] rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="email-attachment" className="text-right">
                  Attachment
                </Label>
              </div>
              <Input id="email-attachment" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const courses = [
  {
    id: "1",
    title: "Introduction to Psychology",
    code: "PSY 101",
    students: 42,
    assignments: 8,
    graded: 5,
  },
  {
    id: "2",
    title: "Advanced Statistics",
    code: "STAT 301",
    students: 28,
    assignments: 12,
    graded: 9,
  },
  {
    id: "3",
    title: "Environmental Science",
    code: "ENV 201",
    students: 35,
    assignments: 6,
    graded: 4,
  },
  {
    id: "4",
    title: "Creative Writing",
    code: "ENG 215",
    students: 22,
    assignments: 10,
    graded: 8,
  },
]

const courseActivity = [
  {
    title: "New assignment created",
    description: "Research Paper - Due Apr 15, 2025",
    time: "2h ago",
  },
  {
    title: "Graded 15 submissions",
    description: "Midterm Exam",
    time: "1d ago",
  },
  {
    title: "Updated syllabus",
    description: "Added new reading materials",
    time: "3d ago",
  },
  {
    title: "New student enrolled",
    description: "Emma Johnson joined the course",
    time: "1w ago",
  },
]

const courseAssignments = [
  {
    id: "1",
    title: "Research Paper",
    dueDate: "Apr 15, 2025",
    status: "Active",
    submissions: "32/42",
  },
  {
    id: "2",
    title: "Midterm Exam",
    dueDate: "Mar 20, 2025",
    status: "Completed",
    submissions: "40/42",
  },
  {
    id: "3",
    title: "Weekly Quiz 5",
    dueDate: "Mar 10, 2025",
    status: "Completed",
    submissions: "38/42",
  },
  {
    id: "4",
    title: "Weekly Quiz 6",
    dueDate: "Mar 17, 2025",
    status: "Completed",
    submissions: "36/42",
  },
  {
    id: "5",
    title: "Weekly Quiz 7",
    dueDate: "Mar 24, 2025",
    status: "Active",
    submissions: "30/42",
  },
  {
    id: "6",
    title: "Final Exam",
    dueDate: "May 10, 2025",
    status: "Draft",
    submissions: "0/42",
  },
]

const courseStudents = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma.j@university.edu",
    completed: "5/8",
    grade: "A-",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    completed: "4/8",
    grade: "B+",
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    email: "s.rodriguez@university.edu",
    completed: "6/8",
    grade: "A",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "j.wilson@university.edu",
    completed: "3/8",
    grade: "B",
  },
  {
    id: "5",
    name: "Olivia Smith",
    email: "o.smith@university.edu",
    completed: "5/8",
    grade: "B+",
  },
  {
    id: "6",
    name: "William Brown",
    email: "w.brown@university.edu",
    completed: "4/8",
    grade: "C+",
  },
]

const lmsIntegrations = [
  {
    id: "canvas",
    name: "Canvas",
    connected: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    id: "google-classroom",
    name: "Google Classroom",
    connected: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary"
      >
        <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
        <path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: "moodle",
    name: "Moodle",
    connected: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m7 10 2 2 7-7" />
      </svg>
    ),
  },
]

const gradingReferences = [
  {
    id: "1",
    title: "APA Style Guide 7th Edition",
    type: "Document",
    added: "Mar 15, 2025",
    usedIn: "3 assignments",
    url: "",
  },
  {
    id: "2",
    title: "Rubric Template - Research Papers",
    type: "Document",
    added: "Feb 28, 2025",
    usedIn: "2 assignments",
    url: "",
  },
  {
    id: "3",
    title: "Purdue OWL Writing Resources",
    type: "Link",
    added: "Mar 10, 2025",
    usedIn: "5 assignments",
    url: "https://owl.purdue.edu/owl/research_and_citation/resources.html",
  },
  {
    id: "4",
    title: "Psychology Journal Citation Examples",
    type: "Text",
    added: "Mar 5, 2025",
    usedIn: "1 assignment",
    url: "",
  },
  {
    id: "5",
    title: "Harvard Referencing Guide",
    type: "Link",
    added: "Feb 20, 2025",
    usedIn: "4 assignments",
    url: "https://www.citethisforme.com/harvard-referencing",
  },
]
