"use client"

import { useState } from "react"
import { MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data
const students = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.j@example.com",
    class: "English 101",
    submissions: 12,
    lastActive: "2 days ago",
  },
  {
    id: 2,
    name: "Jamie Smith",
    email: "jamie.s@example.com",
    class: "English 101",
    submissions: 10,
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Taylor Brown",
    email: "taylor.b@example.com",
    class: "History 202",
    submissions: 8,
    lastActive: "Today",
  },
  {
    id: 4,
    name: "Morgan Davis",
    email: "morgan.d@example.com",
    class: "Math 303",
    submissions: 15,
    lastActive: "3 days ago",
  },
  {
    id: 5,
    name: "Casey Wilson",
    email: "casey.w@example.com",
    class: "Science 404",
    submissions: 9,
    lastActive: "Yesterday",
  },
  {
    id: 6,
    name: "Riley Garcia",
    email: "riley.g@example.com",
    class: "English 101",
    submissions: 11,
    lastActive: "Today",
  },
  {
    id: 7,
    name: "Jordan Lee",
    email: "jordan.l@example.com",
    class: "History 202",
    submissions: 7,
    lastActive: "4 days ago",
  },
  {
    id: 8,
    name: "Avery Martinez",
    email: "avery.m@example.com",
    class: "Math 303",
    submissions: 14,
    lastActive: "Yesterday",
  },
]

export function StudentsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="english">English 101</SelectItem>
            <SelectItem value="history">History 202</SelectItem>
            <SelectItem value="math">Math 303</SelectItem>
            <SelectItem value="science">Science 404</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.submissions}</TableCell>
                <TableCell>{student.lastActive}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Submissions</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
