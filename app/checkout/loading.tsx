import { Loader2 } from "lucide-react"

export default function CheckoutLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-secondary/50 to-background">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">Redirecting to secure checkout...</h1>
        <p className="text-muted-foreground">Please wait while we prepare your trial.</p>
      </div>
    </div>
  )
}
