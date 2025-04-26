"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Loader2, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Submission {
  id: string
  studentName: string
  fileName: string
  fileUrl: string
  score: number
  status: string
  submissionTime: string
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submission: Submission
}

export function ShareDialog({ open, onOpenChange, submission }: ShareDialogProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share the report.",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)

    try {
      // In a real app, this would be an API call to share the report
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Report shared",
        description: `The assessment report has been shared with ${email}.`,
      })

      setEmail("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error sharing report",
        description: "There was an error sharing the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Assessment Report</DialogTitle>
          <DialogDescription>
            Send the assessment report for {submission.fileName.split("/").pop()} to the student or others.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  className="pl-8"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Report Details</Label>
            <div className="rounded-md border p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Student:</span>
                <span className="text-sm">{submission.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Score:</span>
                <span className="text-sm">{submission.score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Submission Date:</span>
                <span className="text-sm">{new Date(submission.submissionTime).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={isSharing}>
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              "Share Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
