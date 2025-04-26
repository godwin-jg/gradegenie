"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ShieldCheck } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui"
import Link from "next/link"
import { Logo } from "@/components/logo"

// Custom icon components
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23" {...props}>
      <path fill="#f1511b" d="M1 1h10v10H1z" />
      <path fill="#80cc28" d="M12 1h10v10H12z" />
      <path fill="#00adef" d="M1 12h10v10H1z" />
      <path fill="#fbbc09" d="M12 12h10v10H12z" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = await res.json()
        // should use state management later
        localStorage.setItem("token", data.token) // Store token in local storage
        localStorage.setItem("user", JSON.stringify(data.user)) // Store user data in local storage
        router.push("/dashboard/assignments") // Redirect to dashboard
      } else if (res.status === 401) {
        setError("Invalid email or password.")
      } else {
        setError("Login failed. Please check your credentials.")
      }
     
    } catch (err) {
      setError("An unexpected error occurred.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Benefits and testimonials (hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-mint/20 p-10 dark:bg-gray-800/50 lg:flex">
        <div>
          <Logo size="lg" />
        </div>
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-onest">Welcome back to GradeGenie</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            The AI-powered grading assistant that saves teachers 5+ hours every week.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-700 dark:text-gray-200">Grade assignments in minutes, not hours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-700 dark:text-gray-200">Provide detailed feedback automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-gray-700 dark:text-gray-200">Used by 10,000+ educators in 500+ schools</span>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M17 9.2c-.03-1.21-.78-1.94-2.2-2.14"></path>
                  <path d="M9.2 9.2c.03-1.21.78-1.94 2.2-2.14"></path>
                  <path d="M5 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9z"></path>
                  <path d="m8 17 4-5 4 5"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  "GradeGenie has transformed my teaching workflow. I can focus on what matters most - teaching!"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">— Sarah Johnson, High School English Teacher</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} GradeGenie. All rights reserved.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <Card className="w-full max-w-md border-0 shadow-lg lg:shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center lg:hidden">
              <Logo size="md" />
            </div>
            <CardTitle className="text-center text-2xl font-bold">Log in to your account</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <GoogleIcon className="mr-2 h-5 w-5 text-[#4285F4]" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <MicrosoftIcon className="mr-2 h-5 w-5 text-[#00A4EF]" />
                Microsoft
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" size="lg" onClick={handleLogin}>
              Log in
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                Sign up for free
              </Link>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <ShieldCheck className="mr-1 h-3 w-3" /> Secure login
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
