import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Mail } from "lucide-react"

export default function ForgotPasswordConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-10 w-10" />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We've sent you a link to reset your password. Please check your inbox and spam folder.
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Back to login</Link>
          </Button>
          <div className="text-center text-sm">
            <p>
              Didn't receive an email?{" "}
              <Link href="/forgot-password" className="text-primary hover:underline">
                Try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
