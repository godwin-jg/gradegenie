import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Upgrade Your Plan | GradeGenie",
  description: "Choose the perfect plan for your grading needs",
}

export default function UpgradePage() {
  return (
    <div className="container max-w-7xl py-10">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Select the perfect plan to enhance your grading experience with GradeGenie
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Basic Plan */}
        <Card className="flex flex-col border-muted">
          <CardHeader className="flex flex-col space-y-1.5">
            <CardTitle className="text-xl">Basic</CardTitle>
            <div className="text-3xl font-bold">
              $9<span className="text-muted-foreground text-sm font-normal">/month</span>
            </div>
            <CardDescription>For individual teachers getting started</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>50 assignments per month</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>AI grading assistance</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Basic plagiarism detection</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>1 classroom</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/checkout?plan=basic">Choose Basic</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan - Highlighted */}
        <Card className="flex flex-col border-primary relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </div>
          <CardHeader className="flex flex-col space-y-1.5">
            <CardTitle className="text-xl">Pro</CardTitle>
            <div className="text-3xl font-bold">
              $19<span className="text-muted-foreground text-sm font-normal">/month</span>
            </div>
            <CardDescription>For dedicated educators with multiple classes</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Unlimited assignments</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Advanced AI grading</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Enhanced plagiarism detection</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>5 classrooms</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>1 co-teacher per classroom</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Priority email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="default" asChild>
              <Link href="/checkout?plan=pro">Choose Pro</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="flex flex-col border-muted">
          <CardHeader className="flex flex-col space-y-1.5">
            <CardTitle className="text-xl">Enterprise</CardTitle>
            <div className="text-3xl font-bold">
              $49<span className="text-muted-foreground text-sm font-normal">/month</span>
            </div>
            <CardDescription>For schools and educational institutions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Unlimited classrooms</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Unlimited co-teachers</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Advanced analytics dashboard</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>LMS integrations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>24/7 phone & email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/checkout?plan=enterprise">Choose Enterprise</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left max-w-5xl mx-auto">
          <div>
            <h3 className="font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next
              billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              Yes, all new users get a 7-day free trial with 10 credits to experience GradeGenie's features.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How does billing work?</h3>
            <p className="text-muted-foreground">
              We offer monthly and annual billing options. Annual plans come with a 20% discount compared to monthly
              plans.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards, PayPal, and school purchase orders for Enterprise plans.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I get a refund?</h3>
            <p className="text-muted-foreground">
              We offer a 30-day money-back guarantee if you're not satisfied with our service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer educational discounts?</h3>
            <p className="text-muted-foreground">
              Yes, we offer special pricing for educational institutions. Contact our sales team for details.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          We offer tailored solutions for schools and districts with specific requirements. Our team will work with you
          to create a custom plan that fits your needs.
        </p>
        <Button size="lg" variant="default" asChild>
          <Link href="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  )
}
