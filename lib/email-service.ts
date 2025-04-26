// This is a mock email service that would be replaced with a real implementation
// using SendGrid, Mailgun, or another email service provider

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailAttachment {
  content: string
  filename: string
  type: string
  disposition?: string
}

export interface EmailOptions {
  to: EmailRecipient | EmailRecipient[]
  subject: string
  html: string
  text?: string
  attachments?: EmailAttachment[]
  from?: EmailRecipient
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
  // In a real implementation, this would call an email service API
  console.log("Sending email:", options)

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate success
  return {
    success: true,
    message: "Email sent successfully",
  }
}

export function convertMarkdownToPdf(markdown: string): Promise<Buffer> {
  // In a real implementation, this would convert markdown to PDF
  // using a library like puppeteer, jspdf, or a server-side service

  // Simulate conversion
  return Promise.resolve(Buffer.from("Mock PDF content"))
}

export function parseEmailList(emailString: string): EmailRecipient[] {
  if (!emailString.trim()) {
    return []
  }

  return emailString
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.includes("@"))
    .map((email) => ({ email }))
}
