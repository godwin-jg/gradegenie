"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PDFViewerWithComments } from "./pdf-viewer-with-comments"
import type { Comment } from "@/types/comments"
import { Download, Share } from "lucide-react"

// Mock data for initial comments
const mockComments: Comment[] = [
  {
    id: "comment-1",
    text: "This introduction effectively sets up the thesis statement and provides good context for the argument.",
    highlight: {
      id: "highlight-1",
      text: "Shakespeare's Macbeth explores the corrupting influence of unchecked ambition on the human psyche.",
      pageIndex: 1,
      position: { x: 100, y: 150, width: 400, height: 20 },
      color: "yellow",
    },
    author: "Dr. Smith",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isAIGenerated: false,
  },
  {
    id: "comment-2",
    text: "Consider strengthening this argument with more specific textual evidence from Act 3.",
    highlight: {
      id: "highlight-2",
      text: "Macbeth's soliloquy reveals his deteriorating mental state after the murder.",
      pageIndex: 2,
      position: { x: 120, y: 250, width: 380, height: 20 },
      color: "yellow",
    },
    author: "Dr. Smith",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isAIGenerated: true,
  },
]

interface SubmissionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submission: {
    id: string
    studentName: string
    fileName: string
    fileUrl: string
    score: number
    maxScore: number
    status: string
    submittedAt: string
    aiPercentage: number
    plagiarismPercentage: number
  }
}

export function SubmissionDetailsDialog({ open, onOpenChange, submission }: SubmissionDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("feedback")
  const [comments, setComments] = useState<Comment[]>(mockComments)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex justify-between items-center">
            <span>{submission.studentName}'s Submission</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button size="sm">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="score">Score</TabsTrigger>
            <TabsTrigger value="integrity">Integrity Check</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="flex-1 overflow-hidden">
            <PDFViewerWithComments
              fileUrl={submission.fileUrl}
              initialComments={comments}
              onCommentsChange={setComments}
            />
          </TabsContent>

          <TabsContent value="score" className="p-4">
            {/* Score content */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Overall Score</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{submission.score}</span>
                  <span className="text-muted-foreground">/ {submission.maxScore}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Scoring Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Content & Analysis</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">18</span>
                      <span className="text-muted-foreground">/ 20</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Organization & Structure</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">16</span>
                      <span className="text-muted-foreground">/ 20</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Evidence & Citations</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">15</span>
                      <span className="text-muted-foreground">/ 20</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Language & Style</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">17</span>
                      <span className="text-muted-foreground">/ 20</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Critical Thinking</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">19</span>
                      <span className="text-muted-foreground">/ 20</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Instructor Notes</h4>
                <p className="text-muted-foreground">
                  Emma's essay demonstrates strong critical thinking and analysis. The content is well-researched and
                  thoughtfully presented. Some improvements could be made in the organization of arguments and citation
                  formatting. Overall, an excellent submission that shows deep engagement with the material.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrity" className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">AI Content Detection</h3>
                    <div
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        submission.aiPercentage > 50
                          ? "bg-red-100 text-red-800"
                          : submission.aiPercentage > 30
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {submission.aiPercentage}% AI Generated
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        submission.aiPercentage > 50
                          ? "bg-red-500"
                          : submission.aiPercentage > 30
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${submission.aiPercentage}%` }}
                    ></div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      Our AI detection system has identified portions of this submission that may have been generated
                      using AI tools like ChatGPT or similar language models.
                    </p>
                    <p className="mt-2">
                      Highlighted sections in the document indicate potential AI-generated content.
                    </p>
                  </div>

                  <Button variant="outline" size="sm" className="mt-2">
                    Run Check Again
                  </Button>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Plagiarism Check</h3>
                    <div
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        submission.plagiarismPercentage > 15
                          ? "bg-red-100 text-red-800"
                          : submission.plagiarismPercentage > 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {submission.plagiarismPercentage}% Similarity
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        submission.plagiarismPercentage > 15
                          ? "bg-red-500"
                          : submission.plagiarismPercentage > 5
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${submission.plagiarismPercentage}%` }}
                    ></div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {submission.plagiarismPercentage <= 5 ? (
                      <p>
                        Low similarity detected. This submission appears to be mostly original work with proper
                        citations.
                      </p>
                    ) : submission.plagiarismPercentage <= 15 ? (
                      <p>Moderate similarity detected. Some sections may require review for proper citation.</p>
                    ) : (
                      <p>
                        High similarity detected. This submission contains significant portions that match existing
                        sources.
                      </p>
                    )}

                    {submission.plagiarismPercentage > 0 && (
                      <>
                        <p className="mt-2">Sources matched with similarities:</p>
                        <ul className="list-disc list-inside mt-1">
                          <li>
                            Johnson, M. (2022). Literary Analysis Techniques.{" "}
                            <span className="text-blue-600 cursor-pointer">View</span>
                          </li>
                          <li>
                            Smith, J. (2021). Shakespeare's Tragedies.{" "}
                            <span className="text-blue-600 cursor-pointer">View</span>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="mt-2">
                    View Detailed Report
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Integrity Summary</h3>
                <p className="text-muted-foreground">
                  {submission.aiPercentage <= 10 && submission.plagiarismPercentage <= 3
                    ? "This submission shows minimal AI usage and plagiarism. The work appears to be primarily original with proper citations."
                    : submission.aiPercentage > 50 || submission.plagiarismPercentage > 15
                      ? `This submission shows significant ${submission.aiPercentage > 50 ? "AI usage" : ""} ${submission.aiPercentage > 50 && submission.plagiarismPercentage > 15 ? "and" : ""} ${submission.plagiarismPercentage > 15 ? "similarity to existing sources" : ""}. A detailed review is recommended.`
                      : `This submission shows moderate AI usage (${submission.aiPercentage}%) ${submission.plagiarismPercentage > 5 ? `and similarity to existing sources (${submission.plagiarismPercentage}%)` : "with minimal similarity to existing sources"}. The student appears to have used AI tools to help structure their essay while contributing original analysis in some sections.`}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
