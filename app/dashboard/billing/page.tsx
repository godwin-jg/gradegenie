"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BillingPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan") || "educator"
  const billingParam = searchParams.get("billing") || "monthly"

  const [selectedPlan, setSelectedPlan] = useState(planParam)
  const [billingCycle, setBillingCycle] = useState(billingParam)

  useEffect(() => {
    setSelectedPlan(planParam)
    setBillingCycle(billingParam)
  }, [planParam, billingParam])

  const plans = {
    educator: {
      name: "Educator",
      monthly: 14.99,
      yearly: 143.9,
      features: [
        "Up to 5 classes",
        "AI-powered assignment generation",
        "Automated grading",
        "Basic plagiarism detection",
        "Email support",
      ],
    },
    department: {
      name: "Department",
      monthly: 74.99,
      yearly: 719.9,
      features: [
        "Up to 25 classes",
        "Everything in Educator plan",
        "Co-teacher collaboration (up to 5 seats)",
        "Advanced plagiarism & AI detection",
        "Priority support",
      ],
    },
    institution: {
      name: "Institution",
      monthly: 149.99,
      yearly: 1439.9,
      features: [
        "Unlimited classes",
        "Everything in Department plan",
        "Unlimited co-teacher seats",
        "LMS integration",
        "24/7 dedicated support",
      ],
    },
  }

  const selectedPlanDetails = plans[selectedPlan as keyof typeof plans]
  const price = billingCycle === "yearly" ? selectedPlanDetails.yearly : selectedPlanDetails.monthly
  const billingText = billingCycle === "yearly" ? "/year" : "/month"

  return (
    <div className="container max-w-6xl py-6">
      <div className="mb-8">
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upgrade to {selectedPlanDetails.name}</h1>
          <p className="mt-2 text-muted-foreground">Choose your billing cycle and payment method</p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Billing Cycle</h2>
            <Tabs value={billingCycle} onValueChange={setBillingCycle} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <div className="mt-4 space-y-6">
              <RadioGroup defaultValue="card">
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1">
                    Credit/Debit Card
                  </Label>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
              </RadioGroup>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name on card</Label>
                  <Input id="name" placeholder="John Smith" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number">Card number</Label>
                  <Input id="number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your plan details before confirming</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{selectedPlanDetails.name} Plan</h3>
                  <div className="font-medium">
                    ${price.toFixed(2)}
                    {billingText}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {billingCycle === "yearly" ? "Billed annually" : "Billed monthly"}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">What's included:</h3>
                <ul className="mt-2 space-y-2">
                  {selectedPlanDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="flex items-center justify-between font-medium">
                <div>Total</div>
                <div>
                  ${price.toFixed(2)}
                  {billingText}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Confirm Subscription</Button>
            </CardFooter>
          </Card>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            By confirming your subscription, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
