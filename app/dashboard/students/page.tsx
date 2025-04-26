import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

export default function StudentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Students</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Students
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>Manage students across all your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search students..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Assignments Completed</TableHead>
                <TableHead>Avg. Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.courses}</TableCell>
                  <TableCell>{student.completed}</TableCell>
                  <TableCell>{student.avgGrade}</TableCell>
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
    </div>
  )
}

const students = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma.j@university.edu",
    courses: "PSY 101, ENG 215",
    completed: "13/18",
    avgGrade: "A-",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    courses: "PSY 101, STAT 301",
    completed: "15/20",
    avgGrade: "B+",
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    email: "s.rodriguez@university.edu",
    courses: "ENV 201, STAT 301",
    completed: "10/18",
    avgGrade: "A",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "j.wilson@university.edu",
    courses: "PSY 101, ENV 201",
    completed: "12/14",
    avgGrade: "B",
  },
  {
    id: "5",
    name: "Olivia Smith",
    email: "o.smith@university.edu",
    courses: "ENG 215, ENV 201",
    completed: "8/16",
    avgGrade: "A-",
  },
  {
    id: "6",
    name: "William Brown",
    email: "w.brown@university.edu",
    courses: "STAT 301, ENG 215",
    completed: "14/20",
    avgGrade: "B+",
  },
  {
    id: "7",
    name: "Ava Garcia",
    email: "a.garcia@university.edu",
    courses: "PSY 101, STAT 301",
    completed: "16/18",
    avgGrade: "A",
  },
  {
    id: "8",
    name: "Ethan Davis",
    email: "e.davis@university.edu",
    courses: "ENV 201, ENG 215",
    completed: "9/16",
    avgGrade: "B-",
  },
]
