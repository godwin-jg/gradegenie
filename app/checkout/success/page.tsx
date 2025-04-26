import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Your trial is active!</h1>
        <p className="text-lg text-muted-foreground mb-6">
          You now have 3 days and 3 AI grading credits to explore GradeGenie.
        </p>

        <div className="bg-secondary rounded-lg p-4 mb-8">
          <h2 className="font-medium mb-2">What's included in your trial:</h2>
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>3 AI grading jobs</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Full access to all features</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>No charges until your trial ends</span>
            </li>
          </ul>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
