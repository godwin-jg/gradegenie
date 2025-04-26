"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Sparkles, BookOpen, Clock, Shield } from "lucide-react"
import Link from "next/link"

interface CreditsExhaustedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreditsExhaustedModal({ open, onOpenChange }: CreditsExhaustedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            You've utilized all 30 grading credits
          </DialogTitle>
          <DialogDescription>
            Upgrade now to continue enhancing your teaching workflow with reliable, AI-powered grading. Use code
            <span className="font-bold mx-1">GENIEFRIENDS20</span> for 20% savings — valid for 24 hours.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm font-medium">How upgrading empowers your teaching:</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Save 5+ hours weekly on grading tasks</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Maintain academic integrity with reliable detection tools</span>
            </li>
            <li className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Deliver consistent, personalized student feedback</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Consider Later
          </Button>
          <Button asChild>
            <Link href="/upgrade">Upgrade Now — 20% Savings</Link>
          </Button>
        </DialogFooter>
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  )
}
