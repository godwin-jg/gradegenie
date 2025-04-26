"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AssignmentPDFPreview } from "@/components/assignment-pdf-preview"

interface PDFPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: string
  rubric: string
  title?: string
  course?: string
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  assignment,
  rubric,
  title = "Assignment",
  course = "Course",
}: PDFPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assignment PDF Preview</DialogTitle>
          <DialogDescription>Preview and download the assignment as a PDF</DialogDescription>
        </DialogHeader>

        <AssignmentPDFPreview assignment={assignment} rubric={rubric} title={title} course={course} />
      </DialogContent>
    </Dialog>
  )
}
