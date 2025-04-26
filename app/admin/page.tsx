import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Download, FileText, GraduationCap, Users } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">GradeGenie</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/admin" className="transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/admin/users" className="transition-colors hover:text-primary">
                Users
              </Link>
              <Link href="/admin/courses" className="transition-colors hover:text-primary">
                Courses
              </Link>
              <Link href="/admin/reports" className="transition-colors hover:text-primary">
                Reports
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">152</div>
              <p className="text-xs text-muted-foreground">+24 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Spring Semester 2025</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments Graded</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">+342 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">842 hrs</div>
              <p className="text-xs text-muted-foreground">Across all instructors</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4 mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Usage</CardTitle>
                <CardDescription>Overview of system usage across the institution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Usage analytics chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage instructors and students in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "Active" ? "default" : user.status === "Pending" ? "outline" : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>Manage courses and departments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.department}</TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              course.status === "Active"
                                ? "default"
                                : course.status === "Upcoming"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {course.status}
                          </Badge>
                        </TableCell>
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
          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Dashboard</CardTitle>
                <CardDescription>
                  Monitor compliance with institutional policies and accreditation requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compliance.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge
                        variant={
                          item.status === "Compliant"
                            ? "default"
                            : item.status === "Partial"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

const users = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    email: "j.smith@university.edu",
    role: "Instructor",
    status: "Active",
    lastActive: "Today",
  },
  {
    id: "2",
    name: "Dr. Michael Johnson",
    email: "m.johnson@university.edu",
    role: "Instructor",
    status: "Active",
    lastActive: "Yesterday",
  },
  {
    id: "3",
    name: "Emma Johnson",
    email: "emma.j@university.edu",
    role: "Student",
    status: "Active",
    lastActive: "2 days ago",
  },
  {
    id: "4",
    name: "Dr. Sarah Williams",
    email: "s.williams@university.edu",
    role: "Department Head",
    status: "Active",
    lastActive: "Today",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "j.wilson@university.edu",
    role: "Student",
    status: "Active",
    lastActive: "3 days ago",
  },
]

const courses = [
  {
    id: "1",
    title: "Introduction to Psychology (PSY 101)",
    department: "Psychology",
    instructor: "Dr. Jane Smith",
    students: 42,
    status: "Active",
  },
  {
    id: "2",
    title: "Advanced Statistics (STAT 301)",
    department: "Mathematics",
    instructor: "Dr. Michael Johnson",
    students: 28,
    status: "Active",
  },
  {
    id: "3",
    title: "Environmental Science (ENV 201)",
    department: "Environmental Studies",
    instructor: "Dr. Robert Brown",
    students: 35,
    status: "Active",
  },
  {
    id: "4",
    title: "Creative Writing (ENG 215)",
    department: "English",
    instructor: "Dr. Sarah Williams",
    students: 22,
    status: "Active",
  },
  {
    id: "5",
    title: "Organic Chemistry (CHEM 302)",
    department: "Chemistry",
    instructor: "Dr. David Lee",
    students: 30,
    status: "Upcoming",
  },
]

const compliance = [
  {
    id: "1",
    title: "Syllabus Compliance",
    description: "All courses have syllabi that meet institutional requirements",
    status: "Compliant",
  },
  {
    id: "2",
    title: "Accessibility Standards",
    description: "Course materials meet accessibility guidelines",
    status: "Partial",
  },
  {
    id: "3",
    title: "Learning Outcomes",
    description: "Courses have defined and measurable learning outcomes",
    status: "Compliant",
  },
  {
    id: "4",
    title: "Grading Transparency",
    description: "Clear grading criteria provided for all assignments",
    status: "Compliant",
  },
  {
    id: "5",
    title: "Student Data Privacy",
    description: "Compliance with FERPA and institutional data policies",
    status: "Compliant",
  },
]
