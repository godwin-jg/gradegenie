"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SubmissionDetailsDialog } from "@/components/submission-details-dialog"
import { Download, ChevronDown, Search, FileText, ExternalLink } from "lucide-react"

// Mock data for submissions
const submissions = [
  {
    id: "1",
    studentName: "Emma Johnson",
    fileName: "Macbeth_Analysis.pdf",
    fileUrl: "/placeholder.svg?height=800&width=600",
    score: 85,
    maxScore: 100,
    comments: "Excellent analysis of themes.",
    status: "Graded",
    submittedAt: "2023-05-15T14:30:00Z",
    aiPercentage: 32,
    plagiarismPercentage: 3,
  },
  {
    id: "2",
    studentName: "Michael Chen",
    fileName: "Shakespeare_Essay.pdf",
    fileUrl: "/placeholder.svg?height=800&width=600",
    score: 92,
    maxScore: 100,
    comments: "Outstanding work on character development.",
    status: "Graded",
    submittedAt: "2023-05-14T09:15:00Z",
    aiPercentage: 12,
    plagiarismPercentage: 2,
  },
  {
    id: "3",
    studentName: "Sophia Rodriguez",
    fileName: "Literary_Analysis.pdf",
    fileUrl: "/placeholder.svg?height=800&width=600",
    score: 78,
    maxScore: 100,
    comments: "Good insights, but needs more textual evidence.",
    status: "Graded",
    submittedAt: "2023-05-16T11:45:00Z",
    aiPercentage: 45,
    plagiarismPercentage: 8,
  },
  {
    id: "4",
    studentName: "James Wilson",
    fileName: "Macbeth_Essay.pdf",
    fileUrl: "/placeholder.svg?height=800&width=600",
    score: null,
    maxScore: 100,
    comments: "",
    status: "Submitted",
    submittedAt: "2023-05-17T16:20:00Z",
    aiPercentage: 0,
    plagiarismPercentage: 0,
  },
  {
    id: "5",
    studentName: "Olivia Kim",
    fileName: "Character_Analysis.pdf",
    fileUrl: "/placeholder.svg?height=800&width=600",
    score: null,
    maxScore: 100,
    comments: "",
    status: "Submitted",
    submittedAt: "2023-05-17T10:30:00Z",
    aiPercentage: 0,
    plagiarismPercentage: 0,
  },
  {
    id: "6",
    studentName: "Ethan Brown",
    fileName: "Theme_Analysis.pdf",
    fileUrl: "/placeholder.svg?height=800&width=600",
    score: 88,
    maxScore: 100,
    comments: "Well-structured analysis with strong conclusion.",
    status: "Graded",
    submittedAt: "2023-05-15T13:10:00Z",
    aiPercentage: 18,
    plagiarismPercentage: 4,
  },
  {
    id: "7",
    studentName: "Ava Martinez",
    fileName: "Shakespeare_Themes.pdf",
    fileUrl: "/placeholder.svg?height=800&width=600",
    score: 90,
    maxScore: 100,
    comments: "Excellent use of quotes and analysis.",
    status: "Graded",
    submittedAt: "2023-05-14T15:45:00Z",
    aiPercentage: 5,
    plagiarismPercentage: 1,
  },
  {
    id: "8",
    studentName: "Noah Thompson",
    fileName: "Macbeth_Characters.pdf",
    fileUrl: "/placeholder.svg?height=800&width=600",
    score: null,
    maxScore: 100,
    comments: "Late submission.",
    status: "Late",
    submittedAt: "2023-05-18T09:00:00Z",
    aiPercentage: 60,
    plagiarismPercentage: 15,
  },
]

export default function SubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<(typeof submissions)[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Filter submissions based on search query
  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Function to get status badge
  function getStatusBadge(status: string) {
    switch (status) {
      case "graded":
        return <Badge className="bg-green-500">Graded</Badge>
      case "submitted":
        return <Badge className="bg-blue-500">Submitted</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  // Function to get score badge
  function getScoreBadge(score: number, maxScore: number) {
    if (score === 0 && ["submitted", "pending"].includes(submissions.find((s) => s.score === score)?.status || "")) {
      return <Badge variant="outline">Not graded</Badge>
    }

    const percentage = (score / maxScore) * 100

    if (percentage >= 90) {
      return (
        <Badge className="bg-green-500">
          {score}/{maxScore}
        </Badge>
      )
    } else if (percentage >= 70) {
      return (
        <Badge className="bg-blue-500">
          {score}/{maxScore}
        </Badge>
      )
    } else if (percentage >= 60) {
      return (
        <Badge className="bg-yellow-500">
          {score}/{maxScore}
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-500">
          {score}/{maxScore}
        </Badge>
      )
    }
  }

  // Function to format date
  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  // Function to handle opening the submission details
  function handleOpenSubmission(submission: (typeof submissions)[0]) {
    setSelectedSubmission(submission)
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Submissions</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search submissions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Export
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Export for Google Classroom</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.studentName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-[150px]">{submission.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getScoreBadge(submission.score, submission.maxScore)}</TableCell>
                  <TableCell>
                    <span className="truncate max-w-[200px] block">{submission.comments || "No comments yet"}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenSubmission(submission)}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedSubmission && (
        <SubmissionDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} submission={selectedSubmission} />
      )}
    </div>
  )
}
