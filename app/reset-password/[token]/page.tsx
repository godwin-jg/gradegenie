"use client"

import { ResetPasswordForm } from "@/components/reset-password-form"
import { Logo } from "@/components/logo"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground">Enter a new password for your account</p>
        </div>
        <ResetPasswordForm token={params.token} />
      </div>
    </div>
  )
}
