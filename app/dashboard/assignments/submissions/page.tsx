"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  FileText,
  Share2,
  ChevronDown,
  Search,
  Filter,
  FileDown,
  FileIcon,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { ShareDialog } from "@/components/share-dialog"
import { SubmissionDetailsDialog } from "@/components/submission-details-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define the submission type
interface Submission {
  id: string
  studentName: string
  fileName: string
  fileUrl: string
  score: number
  comments: {
    strengths: string
    improvementAreas: string
    actionItems: string
    subScores: {
      analyticalArgument: number
      engagementWithText: number
      useLiteraryDevices: number
      academicWriting: number
    }
    justification: string
  }
  status: "Graded" | "Pending" | "In Progress"
  submissionTime: string
  integrityCheck?: {
    status: "Clear" | "Flagged" | "Checking..." | "Not Run"
    aiDetection?: {
      score: number
      confidence: "High" | "Medium" | "Low"
      flaggedPhrases?: string[]
    }
    plagiarism?: {
      matchPercentage: number
      sources: Array<{
        url: string
        matchPercentage: number
        title?: string
      }>
    }
  }
}

export default function SubmissionsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [runningCheckFor, setRunningCheckFor] = useState<string | null>(null)

  // Filter submissions based on search query
  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDownloadAll = () => {
    toast({
      title: "Downloading all submissions",
      description: "All submission reports are being prepared for download.",
    })
    // In a real app, this would trigger the download of all reports
  }

  const handleDownloadFormat = (format: string) => {
    toast({
      title: `Downloading in ${format} format`,
      description: `All submission reports will be downloaded as ${format} files.`,
    })
    // In a real app, this would trigger the download in the specified format
  }

  const handleShare = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsShareDialogOpen(true)
  }

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsDetailsDialogOpen(true)
  }

  const handleRunIntegrityCheck = (submissionId: string) => {
    setRunningCheckFor(submissionId)

    // Simulate API call for integrity check
    setTimeout(() => {
      const updatedSubmissions = submissions.map((submission) => {
        if (submission.id === submissionId) {
          return {
            ...submission,
            integrityCheck: {
              status: Math.random() > 0.7 ? "Flagged" : "Clear",
              aiDetection: {
                score: Math.random() * 100,
                confidence: Math.random() > 0.5 ? "High" : "Medium",
                flaggedPhrases:
                  Math.random() > 0.7
                    ? [
                        "The juxtaposition of imagery creates a stark contrast",
                        "The author's use of metaphor elucidates the underlying theme",
                      ]
                    : [],
              },
              plagiarism: {
                matchPercentage: Math.random() * 30,
                sources:
                  Math.random() > 0.7
                    ? [
                        {
                          url: "https://www.sparknotes.com/shakespeare/macbeth/",
                          matchPercentage: Math.random() * 20,
                          title: "SparkNotes: Macbeth",
                        },
                        {
                          url: "https://www.cliffsnotes.com/literature/m/macbeth/",
                          matchPercentage: Math.random() * 10,
                          title: "CliffsNotes: Macbeth",
                        },
                      ]
                    : [],
              },
            },
          }
        }
        return submission
      })

      // In a real app, this would update the state with the API response
      setRunningCheckFor(null)

      toast({
        title: "Integrity check complete",
        description: "AI detection and plagiarism check have been completed.",
      })
    }, 2500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/assignments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Assignment Submissions</h2>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>The Role of Ambition in Macbeth</CardTitle>
            <CardDescription>Introduction to Literature (ENG 101) • Due Mar 5, 2025</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownloadFormat("PDF")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadFormat("Word")}>
                  <FileIcon className="mr-2 h-4 w-4" />
                  Download as Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by student name or file name..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submission Time</TableHead>
                  <TableHead>Integrity Check</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.studentName}</TableCell>
                    <TableCell>
                      <a
                        href={submission.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <FileText className="mr-1 h-4 w-4" />
                        {submission.fileName.split("/").pop()}
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          submission.score >= 90
                            ? "bg-green-500"
                            : submission.score >= 80
                              ? "bg-green-400"
                              : submission.score >= 70
                                ? "bg-yellow-500"
                                : submission.score >= 60
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                        }
                      >
                        {submission.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.status === "Graded"
                            ? "default"
                            : submission.status === "In Progress"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(submission.submissionTime).toLocaleString()}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              {runningCheckFor === submission.id ? (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                                >
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Checking...
                                </Badge>
                              ) : submission.integrityCheck ? (
                                submission.integrityCheck.status === "Clear" ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                    Clear
                                  </Badge>
                                ) : submission.integrityCheck.status === "Flagged" ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
                                  >
                                    <AlertTriangle className="h-3 w-3" />
                                    Flagged
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                                  >
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Checking...
                                  </Badge>
                                )
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRunIntegrityCheck(submission.id)}
                                  className="h-7 px-2"
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Run Check
                                </Button>
                              )}
                              {submission.integrityCheck && submission.integrityCheck.status !== "Checking..." && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRunIntegrityCheck(submission.id)}
                                  className="h-7 w-7 p-0 ml-1"
                                  disabled={runningCheckFor === submission.id}
                                >
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {submission.integrityCheck ? (
                              submission.integrityCheck.status === "Flagged" ? (
                                <div className="text-xs">
                                  <p className="font-semibold">Potential issues detected:</p>
                                  <p>AI Content: {submission.integrityCheck.aiDetection?.score.toFixed(1)}%</p>
                                  <p>Plagiarism: {submission.integrityCheck.plagiarism?.matchPercentage.toFixed(1)}%</p>
                                  <p className="italic mt-1">Click to view details</p>
                                </div>
                              ) : submission.integrityCheck.status === "Clear" ? (
                                <div className="text-xs">
                                  <p>No integrity issues detected</p>
                                  <p>AI Content: {submission.integrityCheck.aiDetection?.score.toFixed(1)}%</p>
                                  <p>Plagiarism: {submission.integrityCheck.plagiarism?.matchPercentage.toFixed(1)}%</p>
                                </div>
                              ) : (
                                <p className="text-xs">Check in progress...</p>
                              )
                            ) : (
                              <p className="text-xs">Run integrity check</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(submission)}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleShare(submission)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      {selectedSubmission && (
        <ShareDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen} submission={selectedSubmission} />
      )}

      {/* Submission Details Dialog */}
      {selectedSubmission && (
        <SubmissionDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          submission={selectedSubmission}
        />
      )}
    </div>
  )
}

// Dummy data for submissions with integrity checks
const submissions: Submission[] = [
  {
    id: "1",
    studentName: "Emma Johnson",
    fileName: "The_Role_of_Ambition_in_Macbeth_03062025_1246.pdf",
    fileUrl: "https://app.getgradegenie.com/uploads/assignments/The_Role_of_Ambition_in_Macbeth_03062025_1246.pdf",
    score: 85,
    comments: {
      strengths:
        "You have a strong engagement with the text and make effective use of textual evidence and literary devices. Your interpretation of ambition in 'Macbeth' is insightful.",
      improvementAreas:
        "While your argument is clear, it could benefit from more originality and depth. Additionally, the academic writing could be refined for precision.",
      actionItems:
        '• Explore unique perspectives on ambition in the play to deepen your argument.\n• Incorporate a wider range of literary devices for a richer analysis.\n• Review your writing for minor grammatical errors and enhance the sophistication of language, e.g., rephrase "Lady Macbeth\'s initial resolve crumbles" for clarity.',
      subScores: {
        analyticalArgument: 4,
        engagementWithText: 5,
        useLiteraryDevices: 4,
        academicWriting: 4,
      },
      justification:
        "• Analytical Argument (4/5): Clear and structured, but could include more originality.\n• Engagement with Text (5/5): Demonstrates strong textual engagement and understanding of themes.\n• Use of Literary Devices (4/5): Effectively uses literary devices, but a broader range would strengthen analysis.\n• Academic Writing (4/5): Generally clear with a good command of language, though minor errors are present.",
    },
    status: "Graded",
    submissionTime: "2025-03-06 12:46:42",
    integrityCheck: {
      status: "Clear",
      aiDetection: {
        score: 12.3,
        confidence: "Low",
      },
      plagiarism: {
        matchPercentage: 5.7,
        sources: [],
      },
    },
  },
  {
    id: "2",
    studentName: "Michael Chen",
    fileName: "The_Role_of_Ambition_in_Macbeth_2_03062025_1248.pdf",
    fileUrl: "https://app.getgradegenie.com/uploads/assignments/The_Role_of_Ambition_in_Macbeth_2_03062025_1248.pdf",
    score: 52,
    comments: {
      strengths:
        "Your essay provides a clear summary of how ambition affects characters in Macbeth and includes relevant textual evidence to support your points.",
      improvementAreas:
        "The analysis would benefit from deeper examination of the text and more sophisticated argumentation.",
      actionItems:
        "• Focus on developing a more nuanced argument by offering unique insights into Macbeth's ambition.\n• Include a variety of literary devices such as metaphors or symbolism to enhance your analysis.\n• Incorporate more detailed exploration of historical context related to Shakespeare's text.\n• Work on developing more varied sentence structures and improve the overall sophistication of your writing.",
      subScores: {
        analyticalArgument: 3,
        engagementWithText: 3,
        useLiteraryDevices: 1,
        academicWriting: 3,
      },
      justification:
        "• Analytical Argument (3/5): The argument is clear but lacks depth and originality. Consider exploring more nuanced themes.\n• Engagement with Text (3/5): Several quotes are used, but deeper engagement with the text and its context is needed.\n• Use of Literary Devices (1/5): Few literary devices are employed, which weakens the analysis.\n• Academic Writing (3/5): Writing is clear with minor errors, but more sophistication is needed for a higher score.",
    },
    status: "Graded",
    submissionTime: "2025-03-06 12:48:57",
    integrityCheck: {
      status: "Flagged",
      aiDetection: {
        score: 87.5,
        confidence: "High",
        flaggedPhrases: [
          "The juxtaposition of imagery creates a stark contrast between Macbeth's initial hesitation and his subsequent ruthless ambition",
          "The author's use of metaphor elucidates the underlying theme of corrupted power",
        ],
      },
      plagiarism: {
        matchPercentage: 12.3,
        sources: [
          {
            url: "https://www.sparknotes.com/shakespeare/macbeth/themes/",
            matchPercentage: 8.5,
            title: "SparkNotes: Macbeth - Themes",
          },
          {
            url: "https://www.litcharts.com/lit/macbeth/themes/ambition",
            matchPercentage: 3.8,
            title: "LitCharts: Ambition Theme in Macbeth",
          },
        ],
      },
    },
  },
  {
    id: "3",
    studentName: "Sophia Rodriguez",
    fileName: "The_Role_of_Ambition_in_Macbeth_2_copy_03072025_1008.pdf",
    fileUrl:
      "https://app.getgradegenie.com/uploads/assignments/The_Role_of_Ambition_in_Macbeth_2_copy_03072025_1008.pdf",
    score: 60,
    comments: {
      strengths:
        "Your essay clearly addresses the theme of ambition in Macbeth and uses quotes from the play to support your points. This shows a good understanding of the text.",
      improvementAreas:
        "The essay would benefit from a more original analysis of the theme, deeper engagement with the text's historical context, and a more sophisticated use of literary devices.",
      actionItems:
        "• Develop your argument by adding unique perspectives or interpretations about ambition in Macbeth.\n• Include more context about the time period and how it influences the play's themes.\n• Analyze Shakespeare's use of literary devices, such as metaphor and symbolism, to give depth to your essay.\n• Enhance your writing style by varying your sentence structure and vocabulary for a more advanced academic tone.",
      subScores: {
        analyticalArgument: 3,
        engagementWithText: 3,
        useLiteraryDevices: 3,
        academicWriting: 3,
      },
      justification:
        "• Analytical Argument (3/5): The argument is clear and structured but could be more complex and original.\n• Engagement with Text (3/5): Adequate use of textual evidence, but could be improved by deeper exploration of the text and historical context.\n• Use of Literary Devices (3/5): Some use of devices is present, but the analysis lacks depth.\n• Academic Writing (3/5): Writing is clear with minor errors; however, sophistication and precision could be enhanced.",
    },
    status: "Graded",
    submissionTime: "2025-03-07 10:08:45",
    integrityCheck: {
      status: "Checking...",
    },
  },
  {
    id: "4",
    studentName: "James Wilson",
    fileName: "The_Role_of_Ambition_in_Macbeth_2_03072025_1008.pdf",
    fileUrl: "https://app.getgradegenie.com/uploads/assignments/The_Role_of_Ambition_in_Macbeth_2_03072025_1008.pdf",
    score: 60,
    comments: {
      strengths:
        "You have structured your essay with clear engagement in discussing ambition in Macbeth, illustrating how it leads to Macbeth's downfall.",
      improvementAreas:
        "The analysis of Macbeth's ambition could be deeper with more original insights. Provide a more nuanced interpretation of the literary devices used by Shakespeare.",
      actionItems:
        "• Delve deeper into the complexity of ambition as depicted in the play. What does it suggest about human nature?\n• Incorporate a greater number of literary devices and analyze their impact on the themes and characters of the play.\n• Refine your language to enhance precision and clarity. Consider revising some sentences for better readability.",
      subScores: {
        analyticalArgument: 3,
        engagementWithText: 3,
        useLiteraryDevices: 3,
        academicWriting: 3,
      },
      justification:
        "• Analytical Argument (3/5): Clear argument present but lacks depth and originality.\n• Engagement with Text (3/5): Satisfactory engagement with the text, but deeper analysis of themes and context is needed.\n• Use of Literary Devices (3/5): Basic use of literary devices without deep interpretation.\n• Academic Writing (3/5): Writing is clear but would benefit from enhanced sophistication and minor error corrections.",
    },
    status: "Graded",
    submissionTime: "2025-03-07 10:08:45",
  },
  {
    id: "5",
    studentName: "Olivia Smith",
    fileName: "The_Role_of_Ambition_in_Macbeth_copy_03072025_1008.pdf",
    fileUrl: "https://app.getgradegenie.com/uploads/assignments/The_Role_of_Ambition_in_Macbeth_copy_03072025_1008.pdf",
    score: 100,
    comments: {
      strengths:
        "Your essay presents a comprehensive and insightful analysis of ambition in 'Macbeth.' You effectively use literary devices and textual evidence to support your argument, demonstrating deep engagement with the play.",
      improvementAreas:
        "Your essay is strong overall. However, consider including more varied interpretations to explore different perspectives on ambition within the play.",
      actionItems:
        "• Continue to engage deeply with the text and explore alternative interpretations to broaden your analysis.\n• Maintain the clarity and sophistication of your writing in future essays.",
      subScores: {
        analyticalArgument: 5,
        engagementWithText: 5,
        useLiteraryDevices: 5,
        academicWriting: 5,
      },
      justification:
        "• Analytical Argument (5/5): Your argument is well-structured and insightful, showcasing a deep understanding of complex themes.\n• Engagement with Text (5/5): Extensive use of textual evidence demonstrates profound engagement with the source material.\n• Use of Literary Devices (5/5): Effective and varied use of literary devices supports your interpretation and analysis.\n• Academic Writing (5/5): Writing is clear, precise, and sophisticated, with minimal grammatical errors.",
    },
    status: "Graded",
    submissionTime: "2025-03-07 10:08:45",
    integrityCheck: {
      status: "Clear",
      aiDetection: {
        score: 3.2,
        confidence: "Low",
      },
      plagiarism: {
        matchPercentage: 2.1,
        sources: [],
      },
    },
  },
  {
    id: "6",
    studentName: "William Brown",
    fileName: "The_Role_of_Ambition_in_Macbeth_03072025_1008.pdf",
    fileUrl: "https://app.getgradegenie.com/uploads/assignments/The_Role_of_Ambition_in_Macbeth_03072025_1008.pdf",
    score: 95,
    comments: {
      strengths:
        "Your essay presents a compelling and well-structured examination of ambition in 'Macbeth.' Your use of textual evidence effectively supports the analysis, and you demonstrate a profound engagement with Shakespeare's work.",
      improvementAreas:
        "There are minor grammatical issues, such as awkward phrasing, that could be refined to enhance sophistication.",
      actionItems:
        "• Review and refine sentence structures to improve fluency and clarity. For instance, instead of 'Macbeth finds himself tormented by insecurity, leading him to...', consider '[He becomes increasingly tormented by insecurity, which leads him to...]'.\n• Ensure consistency in academic tone and style throughout your writing. Reviewing academic writing samples could be beneficial.",
      subScores: {
        analyticalArgument: 5,
        engagementWithText: 5,
        useLiteraryDevices: 5,
        academicWriting: 4,
      },
      justification:
        "• Analytical Argument (5/5): The argument is insightful and original, with excellent clarity and depth.\n• Engagement with Text (5/5): Profound engagement with Shakespeare's language and themes is evident through extensive textual evidence.\n• Use of Literary Devices (5/5): Literary devices are used effectively to support the analysis.\n• Academic Writing (4/5): The writing is generally clear and precise, though minor errors affect sophistication.",
    },
    status: "Graded",
    submissionTime: "2025-03-07 10:08:45",
    integrityCheck: {
      status: "Flagged",
      aiDetection: {
        score: 24.5,
        confidence: "Medium",
      },
      plagiarism: {
        matchPercentage: 28.7,
        sources: [
          {
            url: "https://www.jstor.org/stable/2872011",
            matchPercentage: 15.3,
            title: "Ambition and Desire: The Paradox of Power in Shakespeare's Macbeth",
          },
          {
            url: "https://www.academia.edu/download/59832145/macbeth_analysis.pdf",
            matchPercentage: 13.4,
            title: "The Corrupting Influence of Ambition in Shakespeare's Macbeth",
          },
        ],
      },
    },
  },
  {
    id: "7",
    studentName: "Ethan Davis",
    fileName: "The_Role_of_Ambition_in_Macbeth_2_03082025_0338.pdf",
    fileUrl: "https://app.getgradegenie.com/uploads/assignments/The_Role_of_Ambition_in_Macbeth_2_03082025_0338.pdf",
    score: 56,
    comments: {
      strengths:
        "Your essay effectively outlines the role of ambition in 'Macbeth' and engages with key lines from the text.",
      improvementAreas:
        "The analysis would benefit from a deeper exploration of themes and literary devices used by Shakespeare. Enhancing your academic writing style would also strengthen your argument.",
      actionItems:
        "• Provide more original insights into the themes of the play rather than a simple plot re-telling.\n• Analyze the use of specific literary devices such as metaphors, symbolism, and any significant language features.\n• Improve grammar by reviewing sentence structures and punctuation. Consider complex sentences to add sophistication to your writing.",
      subScores: {
        analyticalArgument: 3,
        engagementWithText: 3,
        useLiteraryDevices: 2,
        academicWriting: 3,
      },
      justification:
        "• Analytical Argument (3/5): Clear argument with some structure, but lacks originality and depth.\n• Engagement with Text (3/5): Satisfactory engagement with the text using key quotes, but needs deeper exploration of themes.\n• Use of Literary Devices (2/5): Limited analysis of literary devices; needs more examples and depth.\n• Academic Writing (3/5): Mostly clear writing, needs more sophistication and corrected grammatical errors.",
    },
    status: "Graded",
    submissionTime: "2025-03-08 03:38:45",
  },
  {
    id: "8",
    studentName: "Ava Garcia",
    fileName: "The_Role_of_Ambition_in_Macbeth_03082025_0338.pdf",
    fileUrl: "https://app.getgradegenie.com/uploads/assignments/The_Role_of_Ambition_in_Macbeth_03082025_0338.pdf",
    score: 80,
    comments: {
      strengths:
        "Your essay demonstrates a thorough engagement with Shakespeare's text, and your discussion of ambition in Macbeth is both insightful and well-supported by textual evidence.",
      improvementAreas:
        "While your use of literary devices is effective, the analysis can be further deepened for a more profound impact. Additionally, enhancing your academic writing style can improve clarity and sophistication.",
      actionItems:
        "• Delve deeper into the analysis of literary devices by discussing their impact or effectiveness in Shakespeare's portrayal of themes.\n• Enhance your academic writing by varying sentence structure and employing more complex syntax.\n• Review your work to correct minor grammatical issues, such as subject-verb agreement and punctuation.",
      subScores: {
        analyticalArgument: 4,
        engagementWithText: 5,
        useLiteraryDevices: 4,
        academicWriting: 3,
      },
      justification:
        "• Analytical Argument (4/5): Your argument is clearly structured and insightful but could offer a more original angle.\n• Engagement with Text (5/5): You exhibit profound engagement with textual evidence effectively supporting your interpretations.\n• Use of Literary Devices (4/5): You effectively incorporate literary devices, but further exploration can elevate your analysis.\n• Academic Writing (3/5): While generally clear, your writing can benefit from further stylistic refinement and proofreading.",
    },
    status: "Graded",
    submissionTime: "2025-03-08 03:38:45",
  },
]
