import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Testimonials } from "./testimonials"

export const metadata: Metadata = {
  title: "Pricing | GradeGenie",
  description: "Choose the perfect plan for your teaching needs",
}

export default function PricingPage() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, Transparent Pricing</h1>
        <p className="max-w-[85%] text-muted-foreground sm:text-xl">
          Choose the perfect plan for your teaching needs. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>

      <div className="mx-auto mt-12 grid justify-center gap-8">
        <Tabs defaultValue="monthly" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-64 grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly" className="mt-6">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Educator Plan */}
              <Card className="flex flex-col">
                <CardHeader className="flex flex-col space-y-1">
                  <CardTitle className="text-2xl">Educator</CardTitle>
                  <div className="text-4xl font-bold">
                    $14.99<span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>Perfect for individual teachers and tutors.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Up to 5 classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>AI-powered assignment generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Automated grading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Basic plagiarism detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Email support</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/billing?plan=educator">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Department Plan */}
              <Card className="flex flex-col border-primary">
                <CardHeader className="flex flex-col space-y-1">
                  <div className="mx-auto mb-2 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                    Most Popular
                  </div>
                  <CardTitle className="text-2xl">Department</CardTitle>
                  <div className="text-4xl font-bold">
                    $74.99<span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>Ideal for departments and small schools.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Up to 25 classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Everything in Educator plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Co-teacher collaboration (up to 5 seats)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Advanced plagiarism & AI detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/billing?plan=department">Upgrade Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Institution Plan */}
              <Card className="flex flex-col">
                <CardHeader className="flex flex-col space-y-1">
                  <CardTitle className="text-2xl">Institution</CardTitle>
                  <div className="text-4xl font-bold">
                    $149.99<span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>For schools, colleges and universities.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Unlimited classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Everything in Department plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Unlimited co-teacher seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>LMS integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>24/7 dedicated support</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/billing?plan=institution">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="mt-6">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Educator Plan - Yearly */}
              <Card className="flex flex-col">
                <CardHeader className="flex flex-col space-y-1">
                  <CardTitle className="text-2xl">Educator</CardTitle>
                  <div className="text-4xl font-bold">
                    $143.90<span className="text-base font-normal text-muted-foreground">/year</span>
                  </div>
                  <CardDescription>Perfect for individual teachers and tutors.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Up to 5 classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>AI-powered assignment generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Automated grading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Basic plagiarism detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Email support</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/billing?plan=educator&billing=yearly">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Department Plan - Yearly */}
              <Card className="flex flex-col border-primary">
                <CardHeader className="flex flex-col space-y-1">
                  <div className="mx-auto mb-2 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                    Most Popular
                  </div>
                  <CardTitle className="text-2xl">Department</CardTitle>
                  <div className="text-4xl font-bold">
                    $719.90<span className="text-base font-normal text-muted-foreground">/year</span>
                  </div>
                  <CardDescription>Ideal for departments and small schools.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Up to 25 classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Everything in Educator plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Co-teacher collaboration (up to 5 seats)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Advanced plagiarism & AI detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/billing?plan=department&billing=yearly">Upgrade Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Institution Plan - Yearly */}
              <Card className="flex flex-col">
                <CardHeader className="flex flex-col space-y-1">
                  <CardTitle className="text-2xl">Institution</CardTitle>
                  <div className="text-4xl font-bold">
                    $1,439.90<span className="text-base font-normal text-muted-foreground">/year</span>
                  </div>
                  <CardDescription>For schools, colleges and universities.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Unlimited classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Everything in Department plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Unlimited co-teacher seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>LMS integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>24/7 dedicated support</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard/billing?plan=institution&billing=yearly">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Testimonials />

      <div className="mx-auto mt-16 max-w-[58rem] text-center">
        <h2 className="text-2xl font-bold">Still have questions?</h2>
        <p className="mt-2 text-muted-foreground">
          Contact our team for more information about our plans and custom solutions.
        </p>
        <Button asChild className="mt-4">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}
