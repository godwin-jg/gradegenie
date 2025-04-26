"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { useResizeObserver } from "@/hooks/use-resize-observer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { CommentSidebar } from "./comment-sidebar"
import { HighlightLayer } from "./highlight-layer"
import type { Comment } from "@/types/comments"

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerWithCommentsProps {
  fileUrl: string
  initialComments?: Comment[]
  readOnly?: boolean
  onCommentsChange?: (comments: Comment[]) => void
}

export function PDFViewerWithComments({
  fileUrl,
  initialComments = [],
  readOnly = false,
  onCommentsChange,
}: PDFViewerWithCommentsProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [selectedText, setSelectedText] = useState<string>("")
  const [selectionPosition, setSelectionPosition] = useState<{
    pageIndex: number
    boundingRect: DOMRect | null
  } | null>(null)
  const [activeComment, setActiveComment] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<(HTMLDivElement | null)[]>([])

  const { width } = useResizeObserver(containerRef)

  // Function to handle document loading success
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    pagesRef.current = Array(numPages).fill(null)
  }

  // Function to handle text selection
  function handleTextSelection() {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || readOnly) return

    const selectionText = selection.toString().trim()
    if (!selectionText) return

    // Find which page the selection is on
    let pageElement: Element | null = null
    let pageIndex = -1

    for (let i = 0; i < pagesRef.current.length; i++) {
      const page = pagesRef.current[i]
      if (page && page.contains(selection.anchorNode as Node)) {
        pageElement = page
        pageIndex = i
        break
      }
    }

    if (pageElement && pageIndex !== -1) {
      const range = selection.getRangeAt(0)
      const boundingRect = range.getBoundingClientRect()

      setSelectedText(selectionText)
      setSelectionPosition({
        pageIndex: pageIndex + 1, // 1-based page index
        boundingRect,
      })
    }
  }

  // Function to add a new comment
  function addComment(text: string) {
    if (!selectionPosition || !selectedText) return

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text,
      highlight: {
        id: `highlight-${Date.now()}`,
        text: selectedText,
        pageIndex: selectionPosition.pageIndex,
        position: {
          x: selectionPosition.boundingRect?.left || 0,
          y: selectionPosition.boundingRect?.top || 0,
          width: selectionPosition.boundingRect?.width || 0,
          height: selectionPosition.boundingRect?.height || 0,
        },
        color: "yellow",
      },
      author: "Instructor",
      timestamp: new Date().toISOString(),
      isAIGenerated: false,
    }

    const updatedComments = [...comments, newComment]
    setComments(updatedComments)
    onCommentsChange?.(updatedComments)

    // Clear selection
    setSelectedText("")
    setSelectionPosition(null)
    window.getSelection()?.removeAllRanges()
  }

  // Function to update a comment
  function updateComment(id: string, text: string) {
    const updatedComments = comments.map((comment) => (comment.id === id ? { ...comment, text } : comment))
    setComments(updatedComments)
    onCommentsChange?.(updatedComments)
  }

  // Function to delete a comment
  function deleteComment(id: string) {
    const updatedComments = comments.filter((comment) => comment.id !== id)
    setComments(updatedComments)
    onCommentsChange?.(updatedComments)
  }

  // Function to handle highlight click
  function handleHighlightClick(commentId: string) {
    setActiveComment(commentId)
  }

  // Effect to notify parent of comments changes
  useEffect(() => {
    onCommentsChange?.(comments)
  }, [comments, onCommentsChange])

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-200px)]">
      <div
        ref={containerRef}
        className="flex-1 overflow-auto border rounded-md bg-white"
        onMouseUp={handleTextSelection}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-white border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {numPages || "?"}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages || prev))}
              disabled={currentPage >= (numPages || 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="icon" onClick={() => setScale((prev) => Math.min(prev + 0.1, 2.0))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative flex justify-center p-4">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Skeleton className="h-[800px] w-full" />}
            error={<div className="text-center p-4 text-red-500">Failed to load PDF</div>}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div key={`page-${index + 1}`} ref={(el) => (pagesRef.current[index] = el)} className="relative mb-4">
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  width={width ? width - 40 : undefined}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
                <HighlightLayer
                  highlights={comments
                    .filter((comment) => comment.highlight.pageIndex === index + 1)
                    .map((comment) => ({
                      ...comment.highlight,
                      commentId: comment.id,
                      isActive: comment.id === activeComment,
                    }))}
                  scale={scale}
                  onClick={handleHighlightClick}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>

      <Card className="w-full md:w-80 h-full overflow-hidden flex flex-col">
        <CommentSidebar
          comments={comments}
          activeCommentId={activeComment}
          selectedText={selectedText}
          onAddComment={addComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
          onCommentSelect={setActiveComment}
          readOnly={readOnly}
        />
      </Card>
    </div>
  )
}
