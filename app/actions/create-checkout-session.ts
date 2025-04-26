"use server"

import { redirect } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "X",
  {
    apiVersion: "2023-10-16",
  },
)

// Price ID for the subscription
const PRICE_ID = "X" // Replace with your actual price ID

export async function verifyEmailWithReoon(email: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.reoon.com/email-verifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: "X",
        email: email,
      }),
    })

    const result = await response.json()
    return result.status === "valid" && result.smtp_check === true && result.is_disposable === false
  } catch (error) {
    console.error("Error verifying email:", error)
    return false
  }
}

export async function createCheckoutSession(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  // Verify email with Reoon
  const isEmailValid = await verifyEmailWithReoon(email)

  if (!isEmailValid) {
    return {
      error: "Please use a real, non-temporary email address to begin your free trial.",
    }
  }

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 3,
        trial_settings: {
          end_behavior: {
            missing_payment_method: "pause",
          },
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000"}/dashboard/assignments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000"}/signup`,
    })

    if (session.url) {
      redirect(session.url)
    }

    return { sessionId: session.id }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { error: "Failed to create checkout session. Please try again." }
  }
}
