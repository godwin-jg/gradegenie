"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Comment } from "@/types/comments"
import { CommentCard } from "./comment-card"
import { Sparkles, Plus, X } from "lucide-react"

interface CommentSidebarProps {
  comments: Comment[]
  activeCommentId: string | null
  selectedText: string
  onAddComment: (text: string) => void
  onUpdateComment: (id: string, text: string) => void
  onDeleteComment: (id: string) => void
  onCommentSelect: (id: string | null) => void
  readOnly?: boolean
}

export function CommentSidebar({
  comments,
  activeCommentId,
  selectedText,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onCommentSelect,
  readOnly = false,
}: CommentSidebarProps) {
  const [newComment, setNewComment] = useState("")
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  // Sort comments by page and position
  const sortedComments = [...comments].sort((a, b) => {
    if (a.highlight.pageIndex !== b.highlight.pageIndex) {
      return a.highlight.pageIndex - b.highlight.pageIndex
    }
    return a.highlight.position.y - b.highlight.position.y
  })

  // Function to generate AI comment
  async function generateAIComment() {
    if (!selectedText) return

    setIsGeneratingAI(true)

    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Example AI-generated comment based on selected text
      let aiComment = "This section could be improved by..."

      if (selectedText.length < 20) {
        aiComment = "Consider revising this phrase for clarity."
      } else if (
        selectedText.toLowerCase().includes("however") ||
        selectedText.toLowerCase().includes("but") ||
        selectedText.toLowerCase().includes("although")
      ) {
        aiComment = "Good use of transition words to connect contrasting ideas."
      } else if (selectedText.length > 100) {
        aiComment =
          "This paragraph is well-structured but could benefit from more specific examples to support your argument."
      }

      setNewComment(aiComment)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Function to handle comment submission
  function handleSubmitComment() {
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex justify-between items-center bg-muted/30">
        <h3 className="font-medium">Comments ({comments.length})</h3>
        {activeCommentId && (
          <Button variant="ghost" size="icon" onClick={() => onCommentSelect(null)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {selectedText && !readOnly && (
            <div className="border rounded-md p-3 bg-muted/20">
              <div className="text-sm font-medium mb-2">Selected Text:</div>
              <div className="text-sm italic mb-3 line-clamp-3">"{selectedText}"</div>

              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[80px] mb-2"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={generateAIComment}
                  disabled={isGeneratingAI}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  {isGeneratingAI ? "Generating..." : "AI Suggest"}
                </Button>
                <Button size="sm" className="flex-1" onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          )}

          {sortedComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {readOnly ? "No comments on this document" : "Select text to add comments"}
            </div>
          ) : (
            sortedComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isActive={comment.id === activeCommentId}
                onUpdate={(text) => onUpdateComment(comment.id, text)}
                onDelete={() => onDeleteComment(comment.id)}
                onClick={() => onCommentSelect(comment.id)}
                readOnly={readOnly}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
