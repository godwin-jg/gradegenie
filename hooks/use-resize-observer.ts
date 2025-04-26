"use client"

import { useEffect, useState, type RefObject } from "react"

interface ResizeObserverEntry {
  target: Element
  contentRect: DOMRectReadOnly
}

export function useResizeObserver(ref: RefObject<Element>) {
  const [size, setSize] = useState<{ width?: number; height?: number }>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const { width, height } = entries[0].contentRect
      setSize({ width, height })
    })

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return size
}
