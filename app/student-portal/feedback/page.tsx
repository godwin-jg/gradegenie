"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MessageSquare, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FeedbackPage() {
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI tutor. How can I help you with your coursework today?",
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to chat
    setChatHistory([...chatHistory, { role: "user", content: message }])

    // Clear input
    setMessage("")

    // Simulate AI response
    setIsLoading(true)
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'd be happy to help with that! Based on your question about cognitive biases in psychology, I can explain that these are systematic patterns of deviation from norm or rationality in judgment. There are several types of cognitive biases, including confirmation bias, anchoring bias, and availability heuristic. Would you like me to explain any of these in more detail or provide examples of how they might appear in everyday life?",
        },
      ])
      setIsLoading(false)
    }, 2000)
  }

  const handleDraftFeedback = () => {
    setIsLoading(true)

    // Simulate AI generating feedback
    setTimeout(() => {
      toast({
        title: "Draft Feedback Generated",
        description: "Your draft has been analyzed and feedback is ready",
      })
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Learning Support</h2>
      </div>
      <Tabs defaultValue="tutor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tutor">AI Tutor</TabsTrigger>
          <TabsTrigger value="feedback">Pre-Submission Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="tutor" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Chat with AI Tutor</CardTitle>
              <CardDescription>Ask questions about your coursework and get instant help</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.role === "assistant" ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        chat.role === "assistant"
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {chat.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-2 bg-muted text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex w-full items-center space-x-2">
                <Textarea
                  placeholder="Type your question here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Get Pre-Submission Feedback</CardTitle>
              <CardDescription>
                Upload your draft to receive AI-powered feedback before final submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignment">Assignment</Label>
                <Select defaultValue="research">
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research Paper (PSY 101)</SelectItem>
                    <SelectItem value="problem">Problem Set 3 (STAT 301)</SelectItem>
                    <SelectItem value="project">Group Project (ENV 201)</SelectItem>
                    <SelectItem value="story">Short Story (ENG 215)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-type">Feedback Focus</Label>
                <Select defaultValue="comprehensive">
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Comprehensive Review</SelectItem>
                    <SelectItem value="structure">Structure & Organization</SelectItem>
                    <SelectItem value="content">Content & Analysis</SelectItem>
                    <SelectItem value="grammar">Grammar & Style</SelectItem>
                    <SelectItem value="citations">Citations & References</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="draft">Upload Draft</Label>
                <div className="flex w-full items-center gap-2">
                  <Input id="draft" type="file" />
                  <Button variant="outline">Browse</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea id="notes" placeholder="Any specific areas you'd like feedback on?" rows={4} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleDraftFeedback} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Draft...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Get Feedback
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
