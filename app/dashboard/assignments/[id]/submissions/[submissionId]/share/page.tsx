"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, Copy, Mail } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function ShareSubmissionPage({
  params,
}: {
  params: { id: string; submissionId: string }
}) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [includeComments, setIncludeComments] = useState(true)
  const [includeGrades, setIncludeGrades] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const { toast } = useToast()

  // Mock submission data
  const submission = {
    id: params.submissionId,
    assignmentId: params.id,
    assignmentTitle: "Essay on Climate Change",
    studentName: "John Doe",
  }

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSharing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSharing(false)
    setIsShared(true)

    toast({
      title: "Submission shared",
      description: `The submission has been shared with ${email}`,
      variant: "default",
    })
  }

  const copyLink = () => {
    const link = `https://gradegenie.app/shared/submission/${params.submissionId}`
    navigator.clipboard.writeText(link)

    toast({
      title: "Link copied",
      description: "Shareable link has been copied to clipboard",
      variant: "default",
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/assignments/${params.id}/submissions/${params.submissionId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Share Submission</h1>
          <p className="text-muted-foreground">
            {submission.assignmentTitle} - {submission.studentName}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Share via Email</CardTitle>
          <CardDescription>Send this submission to a student or colleague</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShare} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label>Include in shared submission:</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-comments"
                  checked={includeComments}
                  onCheckedChange={(checked) => setIncludeComments(checked as boolean)}
                />
                <Label htmlFor="include-comments" className="cursor-pointer">
                  Comments and feedback
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-grades"
                  checked={includeGrades}
                  onCheckedChange={(checked) => setIncludeGrades(checked as boolean)}
                />
                <Label htmlFor="include-grades" className="cursor-pointer">
                  Grades and scores
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSharing || isShared}>
              {isSharing ? (
                "Sharing..."
              ) : isShared ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Shared Successfully
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" /> Share Submission
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Or Share via Link</CardTitle>
          <CardDescription>Create a shareable link to this submission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              readOnly
              value={`https://gradegenie.app/shared/submission/${params.submissionId}`}
              className="font-mono text-sm"
            />
            <Button variant="outline" size="icon" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          This link will expire in 30 days. Anyone with the link can view this submission.
        </CardFooter>
      </Card>
    </div>
  )
}
