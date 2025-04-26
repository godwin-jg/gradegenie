"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<"educator" | "department" | "institution">("educator")
  const router = useRouter()

  const handleUpgrade = () => {
    // In a real implementation, this would navigate to checkout with the selected plan
    router.push(`/dashboard/billing?plan=${selectedPlan}&cycle=${billingCycle}`)
    onClose()
  }

  const plans = [
    {
      id: "educator",
      name: "Educator",
      description: "Perfect for individual teachers",
      monthlyPrice: 14.99,
      yearlyPrice: 143.9, // 20% discount applied
      features: [
        "AI-powered grading",
        "Unlimited assignments",
        "Up to 150 students",
        "Basic analytics",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "department",
      name: "Department",
      description: "Ideal for teaching teams",
      monthlyPrice: 74.99,
      yearlyPrice: 719.9, // 20% discount applied
      features: [
        "Everything in Educator",
        "Up to 5 teacher accounts",
        "Up to 500 students",
        "Advanced analytics",
        "Priority support",
        "LMS integrations",
      ],
      popular: true,
    },
    {
      id: "institution",
      name: "Institution",
      description: "For schools and universities",
      monthlyPrice: 149.99,
      yearlyPrice: 1439.9, // 20% discount applied
      features: [
        "Everything in Department",
        "Unlimited teacher accounts",
        "Unlimited students",
        "Custom branding",
        "Dedicated account manager",
        "API access",
        "SSO authentication",
      ],
      popular: false,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upgrade Your GradeGenie Plan</DialogTitle>
          <DialogDescription>Choose the plan that works best for you and your students.</DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              variant={billingCycle === "monthly" ? "default" : "outline"}
              onClick={() => setBillingCycle("monthly")}
              className="w-32"
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "outline"}
              onClick={() => setBillingCycle("yearly")}
              className="w-32"
            >
              Yearly
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </Button>
          </div>

          <RadioGroup value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as any)}>
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-lg border p-4 ${
                    selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">Most Popular</Badge>
                  )}
                  <div className="flex items-start">
                    <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                    <div className="ml-3 w-full">
                      <div className="flex justify-between">
                        <Label htmlFor={plan.id} className="text-lg font-medium cursor-pointer">
                          {plan.name}
                        </Label>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{billingCycle === "monthly" ? "month" : "year"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="bg-muted p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <h4 className="font-medium">Your free trial benefits will be extended</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Upgrading now will preserve your remaining trial credits and add them to your paid plan.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Cancel
          </Button>
          <Button onClick={handleUpgrade} className="sm:w-auto w-full">
            Upgrade to {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
