"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmailPreview } from "@/components/email-preview"

interface EmailPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: string
  rubric: string
  title?: string
  course?: string
}

export function EmailPreviewDialog({
  open,
  onOpenChange,
  assignment,
  rubric,
  title = "Assignment",
  course = "Course",
}: EmailPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Assignment to Students</DialogTitle>
          <DialogDescription>Send the assignment and rubric directly to your students</DialogDescription>
        </DialogHeader>

        <EmailPreview assignment={assignment} rubric={rubric} title={title} course={course} />
      </DialogContent>
    </Dialog>
  )
}
