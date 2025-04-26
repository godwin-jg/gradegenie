"use client"

import { useRef } from "react"
import type { Highlight } from "@/types/comments"

interface HighlightLayerProps {
  highlights: (Highlight & { commentId: string; isActive: boolean })[]
  scale: number
  onClick: (commentId: string) => void
}

export function HighlightLayer({ highlights, scale, onClick }: HighlightLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)

  // Adjust highlight positions based on scale
  const scaledHighlights = highlights.map((highlight) => ({
    ...highlight,
    position: {
      x: highlight.position.x * scale,
      y: highlight.position.y * scale,
      width: highlight.position.width * scale,
      height: highlight.position.height * scale,
    },
  }))

  return (
    <div ref={layerRef} className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
      {scaledHighlights.map((highlight) => (
        <div
          key={highlight.id}
          className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 ${
            highlight.isActive ? "bg-yellow-300 ring-2 ring-yellow-500" : "bg-yellow-200 hover:bg-yellow-300"
          }`}
          style={{
            left: `${highlight.position.x}px`,
            top: `${highlight.position.y}px`,
            width: `${highlight.position.width}px`,
            height: `${highlight.position.height}px`,
            opacity: 0.5,
          }}
          onClick={(e) => {
            e.stopPropagation()
            onClick(highlight.commentId)
          }}
          title={highlight.text}
        />
      ))}
    </div>
  )
}
