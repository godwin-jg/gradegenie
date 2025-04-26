"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, Check } from "lucide-react"
import Link from "next/link"

const planDetails = {
  basic: {
    name: "Basic",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: [
      "50 assignments per month",
      "AI grading assistance",
      "Basic plagiarism detection",
      "1 classroom",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      "Unlimited assignments",
      "Advanced AI grading",
      "Enhanced plagiarism detection",
      "5 classrooms",
      "1 co-teacher per classroom",
      "Priority email support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      "Everything in Pro",
      "Unlimited classrooms",
      "Unlimited co-teachers",
      "Advanced analytics dashboard",
      "LMS integrations",
      "Dedicated account manager",
      "24/7 phone & email support",
    ],
  },
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan") || "pro"
  const [plan, setPlan] = useState(planParam)
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isProcessing, setIsProcessing] = useState(false)

  // Ensure plan is valid
  useEffect(() => {
    if (!["basic", "pro", "enterprise"].includes(plan)) {
      setPlan("pro")
    }
  }, [plan])

  const selectedPlan = planDetails[plan as keyof typeof planDetails]
  const price = billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      window.location.href = "/dashboard?upgraded=true"
    }, 2000)
  }

  return (
    <div className="container max-w-6xl py-10">
      <Link href="/upgrade" className="flex items-center text-sm mb-8 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to plans
      </Link>

      <div className="grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground mt-2">Complete your purchase to upgrade your GradeGenie experience</p>
          </div>

          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="card">Credit Card</TabsTrigger>
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
            </TabsList>
            <TabsContent value="card">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Billing Information</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Payment Details</h2>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="expMonth">Expiration Month</Label>
                        <Input id="expMonth" placeholder="MM" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expYear">Expiration Year</Label>
                        <Input id="expYear" placeholder="YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Pay $${price.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="paypal">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="mb-4 text-muted-foreground">
                  You will be redirected to PayPal to complete your purchase.
                </p>
                <Button onClick={handleSubmit} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Continue to PayPal"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your plan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{selectedPlan.name} Plan</h3>
                  <RadioGroup value={billingCycle} onValueChange={setBillingCycle} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="cursor-pointer">
                        Monthly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yearly" id="yearly" />
                      <Label htmlFor="yearly" className="cursor-pointer">
                        Yearly (Save 20%)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <p className="text-2xl font-bold">${price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {billingCycle === "monthly"
                    ? "per month"
                    : "per year (equivalent to $" + (price / 12).toFixed(2) + "/month)"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">What's included:</h3>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                By proceeding with your purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
              <p className="text-sm text-muted-foreground">
                You can cancel or change your subscription at any time from your account settings.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
