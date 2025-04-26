import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "X",
  {
    apiVersion: "2023-10-16",
  },
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_your_webhook_secret"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.trial_will_end":
      // Send reminder email
      const subscription = event.data.object as Stripe.Subscription
      console.log(`Trial will end for subscription: ${subscription.id}`)
      // TODO: Send email notification
      break

    case "invoice.payment_failed":
      // Handle failed payment
      const invoice = event.data.object as Stripe.Invoice
      console.log(`Payment failed for invoice: ${invoice.id}`)
      // TODO: Update user access in database
      break

    case "customer.subscription.updated":
      // Check if subscription status changed
      const updatedSubscription = event.data.object as Stripe.Subscription
      console.log(`Subscription updated: ${updatedSubscription.id}, status: ${updatedSubscription.status}`)
      // TODO: Update user subscription status in database
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
