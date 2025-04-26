"use client"

import { useState, useEffect, type RefObject } from "react"

interface TextSelection {
  text: string
  pageIndex: number
  boundingRect: DOMRect | null
}

export function usePdfTextSelection(
  containerRef: RefObject<HTMLElement>,
  pagesRef: RefObject<(HTMLElement | null)[]>,
  enabled = true,
) {
  const [selection, setSelection] = useState<TextSelection | null>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const handleTextSelection = () => {
      const windowSelection = window.getSelection()
      if (!windowSelection || windowSelection.isCollapsed) {
        setSelection(null)
        return
      }

      const selectionText = windowSelection.toString().trim()
      if (!selectionText) {
        setSelection(null)
        return
      }

      // Find which page the selection is on
      let pageElement: Element | null = null
      let pageIndex = -1

      if (pagesRef.current) {
        for (let i = 0; i < pagesRef.current.length; i++) {
          const page = pagesRef.current[i]
          if (page && page.contains(windowSelection.anchorNode as Node)) {
            pageElement = page
            pageIndex = i
            break
          }
        }
      }

      if (pageElement && pageIndex !== -1) {
        const range = windowSelection.getRangeAt(0)
        const boundingRect = range.getBoundingClientRect()

        setSelection({
          text: selectionText,
          pageIndex: pageIndex + 1, // 1-based page index
          boundingRect,
        })
      }
    }

    const handleMouseUp = () => {
      setTimeout(handleTextSelection, 10) // Small delay to ensure selection is complete
    }

    containerRef.current.addEventListener("mouseup", handleMouseUp)

    return () => {
      containerRef.current?.removeEventListener("mouseup", handleMouseUp)
    }
  }, [containerRef, pagesRef, enabled])

  return selection
}
