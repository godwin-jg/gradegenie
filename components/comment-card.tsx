"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Comment } from "@/types/comments"
import { formatDistanceToNow } from "date-fns"
import { Edit2, Trash2, Save, X, Sparkles } from "lucide-react"

interface CommentCardProps {
  comment: Comment
  isActive: boolean
  onUpdate: (text: string) => void
  onDelete: () => void
  onClick: () => void
  readOnly?: boolean
}

export function CommentCard({ comment, isActive, onUpdate, onDelete, onClick, readOnly = false }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)

  // Function to handle save
  function handleSave() {
    if (editText.trim()) {
      onUpdate(editText.trim())
    }
    setIsEditing(false)
  }

  // Function to handle cancel
  function handleCancel() {
    setEditText(comment.text)
    setIsEditing(false)
  }

  return (
    <div
      className={`border rounded-md p-3 transition-all ${
        isActive ? "ring-2 ring-primary bg-muted/20" : "hover:bg-muted/10"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">{comment.author}</span>
          {comment.isAIGenerated && <Sparkles className="h-3 w-3 text-purple-500" />}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
        </span>
      </div>

      <div className="text-xs text-muted-foreground mb-2">
        Page {comment.highlight.pageIndex} •
        <span className="italic ml-1">
          "{comment.highlight.text.substring(0, 40)}
          {comment.highlight.text.length > 40 ? "..." : ""}"
        </span>
      </div>

      {isEditing ? (
        <>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[80px] mb-2 text-sm"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!editText.trim()}>
              <Save className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="text-sm mb-2">{comment.text}</div>
          {!readOnly && (
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
