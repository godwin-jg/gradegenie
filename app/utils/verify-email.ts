export async function verifyEmailWithReoon(email: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.reoon.com/email-verifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: "Gw1mtcViTSGNgEv3ZZY5yQyeQCzFHMGF",
        email: email,
      }),
    })

    if (!response.ok) {
      console.error("Reoon API error:", response.statusText)
      return true // Fallback to true if API fails
    }

    const result = await response.json()

    // Check if the email is valid based on Reoon's criteria
    return result.status === "valid" && result.smtp_check === true && result.is_disposable === false
  } catch (error) {
    console.error("Error verifying email:", error)
    return true // Fallback to true if there's an error
  }
}
