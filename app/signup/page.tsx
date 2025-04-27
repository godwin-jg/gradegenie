"use client"
import Link from "next/link"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  CheckIcon,
  CreditCard,
  ArrowLeft,
  Sparkles,
  Shield,
  Check,
  BadgeCheck,
  Zap,
  BookOpen,
  ShieldCheck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo"
import { set } from "date-fns"

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

export default function SignupPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [password, setPassword] = useState("")
  const [billingCycle, setBillingCycle] = useState("yearly")
  const [selectedPlan, setSelectedPlan] = useState("department")

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      setError("")
      if (!email || !name || !password) {
        setError("Please fill in all fields")
        return
      }
      if (!email.includes("@") || !email.includes(".")) {
        setError("Please enter a valid email address")
        return
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters")
        return
      }
    }
    if (step === 2) {
      try {
        console.log("Form submitted with values:", { email, name, password, billingCycle, selectedPlan })
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/"
        const response = await fetch(`${apiUrl}auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, selectedPlan, billingCycle }),
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
        }
        console.log("Registration successful");
        setStep(2)
      } catch (error: any) {
        console.error("Registration error");
        setError(error.message);
      }
      console.log("Plan selected:", selectedPlan)
      setStep(3)
    }
    
  }

  const handleBack = () => {
    if (step === 1) return
    if (step === 2) {
      setStep(1)
      setError("")
      setEmail("")
      setName("")
      setPassword("")
      setBillingCycle("yearly")
      setSelectedPlan("department")
    }
    else
    setStep(step - 1)
  }


  const plans = {
    monthly: {
      educator: {
        name: "Educator",
        price: "$14.99",
        period: "/month",
        yearlyPrice: "$143.90",
        yearlyPeriod: "/year",
        savings: "Save 20%",
        features: [
          "Grade up to 5 classes with AI precision",
          "Create custom assignments in seconds",
          "Provide detailed, personalized feedback",
          "Detect AI-generated content automatically",
          "Access email support within 24 hours",
        ],
      },
      department: {
        name: "Department",
        price: "$74.99",
        period: "/month",
        yearlyPrice: "$719.90",
        yearlyPeriod: "/year",
        savings: "Save 20%",
        popular: true,
        features: [
          "Support for up to 25 classes with full analytics",
          "Everything in Educator plan, plus:",
          "Team collaboration with 5 teacher accounts",
          "Advanced plagiarism & AI detection tools",
          "Priority support with 12-hour response time",
        ],
      },
      institution: {
        name: "Institution",
        price: "$149.99",
        period: "/month",
        yearlyPrice: "$1,439.90",
        yearlyPeriod: "/year",
        savings: "Save 20%",
        features: [
          "Unlimited classes with institution-wide insights",
          "Everything in Department plan, plus:",
          "Unlimited teacher collaboration & accounts",
          "Seamless LMS integration with Canvas, Moodle & more",
          "Dedicated support manager & 24/7 assistance",
        ],
      },
    },
    yearly: {
      educator: {
        name: "Educator",
        price: "$143.90",
        period: "/year",
        monthlyEquivalent: "$11.99/mo",
        savings: "Save 20%",
        features: [
          "Grade up to 5 classes with AI precision",
          "Create custom assignments in seconds",
          "Provide detailed, personalized feedback",
          "Detect AI-generated content automatically",
          "Access email support within 24 hours",
        ],
      },
      department: {
        name: "Department",
        price: "$719.90",
        period: "/year",
        monthlyEquivalent: "$59.99/mo",
        savings: "Save 20%",
        popular: true,
        features: [
          "Support for up to 25 classes with full analytics",
          "Everything in Educator plan, plus:",
          "Team collaboration with 5 teacher accounts",
          "Advanced plagiarism & AI detection tools",
          "Priority support with 12-hour response time",
        ],
      },
      institution: {
        name: "Institution",
        price: "$1,439.90",
        period: "/year",
        monthlyEquivalent: "$119.99/mo",
        savings: "Save 20%",
        features: [
          "Unlimited classes with institution-wide insights",
          "Everything in Department plan, plus:",
          "Unlimited teacher collaboration & accounts",
          "Seamless LMS integration with Canvas, Moodle & more",
          "Dedicated support manager & 24/7 assistance",
        ],
      },
    },
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="mx-auto w-full max-w-5xl grid md:grid-cols-5 gap-6">
        {/* Left side - Benefits */}
        <div className="md:col-span-2 hidden md:flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Unlock Effortless Teaching with Your AI Assistant</h2>
            <p className="text-muted-foreground">
              Join a community of educators who are transforming their classrooms with the power of AI.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Reclaim Your Time</h3>
                <p className="text-sm text-muted-foreground">
                  Automate tedious tasks and focus on what you love: connecting with students.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Elevate Student Success</h3>
                <p className="text-sm text-muted-foreground">
                  Provide personalized feedback that fosters growth and understanding.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Maintain Academic Integrity</h3>
                <p className="text-sm text-muted-foreground">
                  Confidently uphold standards with advanced AI and plagiarism detection.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <blockquote className="text-sm italic">
              "GradeGenie has given me back my evenings and weekends! I'm more present for my students and my family."
            </blockquote>
            <div className="mt-2 text-sm font-medium">— Sarah Johnson, High School English Teacher</div>
          </div>
        </div>

        {/* Right side - Signup form */}
        <Card className="md:col-span-3 w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              {step === 1 && "Start Your Effortless Teaching Journey"}
              {step === 2 && "Choose Your Teaching Support Plan"}
              {step === 3 && "Complete Your Registration"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 && "Get 30 AI grading credits to experience the GradeGenie difference"}
              {step === 2 && "Select the support level that fits your teaching needs — no charges during trial"}
              {step === 3 && "Your trial begins today — no charges until it ends"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 ? (
              <form onSubmit={handleContinue} className="space-y-4">
                {/* <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MicrosoftIcon className="mr-2 h-5 w-5" />
                    Microsoft
                  </Button>
                </div> */}

                {/* <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div> */}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Smith"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Work or .edu email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@edu.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      required />
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
                  </div>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    Your 3-day trial empowers you with:
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      <span>
                        <strong>30 grading credits</strong> to streamline your assessment workflow
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      <span>Complete access to all teaching enhancement tools</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      <span>Flexible cancellation — you maintain control</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full py-6 text-base" type="submit">
                  Start Your Free, Effortless Teaching Journey
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-2">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            ) : step === 2 ? (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center rounded-full bg-mint px-3 py-1 text-sm text-gray-800 mb-2">
                    <BadgeCheck className="mr-1 h-4 w-4" />
                    <span>Your account is secure — no charges during your trial</span>
                  </div>
                </div>

                <div className="flex justify-center items-center space-x-4 mb-2">
                  <span className={`text-base ${billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}`}>
                    Monthly
                  </span>
                  <div className="relative">
                    <Switch
                      checked={billingCycle === "yearly"}
                      onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                      className="data-[state=checked]:bg-primary"
                    />
                    {billingCycle === "yearly" && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-mint px-2 py-0.5 text-xs font-medium text-gray-800">
                        Save 20%
                      </span>
                    )}
                  </div>
                  <span className={`text-base ${billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}`}>
                    Yearly
                  </span>
                </div>

                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid gap-4 md:grid-cols-3">
                  {Object.entries(plans[billingCycle as keyof typeof plans]).map(([planId, plan]) => (
                    <div key={planId} className="relative">
                      {plan.popular && (
                        <div className="absolute -top-3 left-0 right-0 mx-auto w-max rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                          Most Popular
                        </div>
                      )}
                      <Label
                        htmlFor={planId}
                        className={`flex h-full flex-col rounded-lg border-2 p-4 hover:bg-accent cursor-pointer ${
                          selectedPlan === planId
                            ? "border-primary bg-primary/5"
                            : "border-muted bg-background hover:bg-accent/50"
                        }`}
                      >
                        <RadioGroupItem value={planId} id={planId} className="sr-only" />
                        <div className="mb-2">
                          <h3 className="font-medium">{plan.name}</h3>
                        </div>
                        <div className="mb-2">
                          <span className="text-2xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                          {billingCycle === "yearly" && (
                            <div className="text-sm text-muted-foreground">{plan.monthlyEquivalent}</div>
                          )}
                        </div>
                        <ul className="mb-2 space-y-1 text-sm">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {selectedPlan === planId && (
                          <div className="mt-auto">
                            <div className="rounded-md bg-primary/10 p-2 text-xs text-center">Selected</div>
                          </div>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="rounded-lg border border-mint bg-mint/20 p-4 text-gray-800">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Your trial begins with full access</p>
                      <p className="text-sm mt-1">
                        Experience all features with no charges until your 3-day trial concludes. You maintain complete
                        control to cancel anytime.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button className="w-full py-6 text-base" onClick={handleContinue}>
                    Continue — Secure Trial Access
                  </Button>
                  <Button variant="ghost" onClick={handleBack} className="mt-2">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="card">Payment Information</Label>
                  <span className="text-sm font-medium text-primary">Secure — No charges today</span>
                </div>

                <div className="border rounded-md p-4 bg-white space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="text-xs text-muted-foreground">
                      Card number
                    </Label>
                    <Input id="card-number" placeholder="4242 4242 4242 4242" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-xs text-muted-foreground">
                        Expiry date
                      </Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc" className="text-xs text-muted-foreground">
                        CVC
                      </Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Your information is protected with bank-level encryption
                  </span>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-primary" />
                      Your selected teaching support:
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="h-7 text-xs">
                      Adjust
                    </Button>
                  </div>

                  <div className="mb-3 pb-3 border-b">
                    <div className="font-medium">
                      {plans[billingCycle as keyof typeof plans][selectedPlan as keyof typeof plans.monthly].name} Plan
                      ({billingCycle === "yearly" ? "Annual" : "Monthly"})
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-muted-foreground">
                        {billingCycle === "yearly" ? "Annual investment" : "Monthly investment"}
                      </div>
                      <div className="font-medium">
                        {plans[billingCycle as keyof typeof plans][selectedPlan as keyof typeof plans.monthly].price}
                      </div>
                    </div>
                    {billingCycle === "yearly" && (
                      <div className="text-xs text-primary mt-1">You optimize your budget with 20% annual savings</div>
                    )}
                  </div>

                  <h4 className="text-sm font-medium mb-2">Your 3-day trial includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      <span>
                        <strong>30 grading credits</strong> to enhance your teaching workflow
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      <span>Full access to all assessment tools</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                      <span>Complete control to cancel before trial ends — no charges</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-2">
                    <Button
                    className="w-full py-6 text-base"
                    asChild
                    onClick={() =>
                      toast({
                      title: "Success",
                      description: "Please Login to continue",
                      })
                    }
                    >
                    <Link href="/login">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Activate Your Trial — Secure & No Charges Today
                    </Link>
                    </Button>

                  <Button variant="ghost" onClick={handleBack} className="mt-2">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Log in
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


