/**
 * Converts PDF coordinates to screen coordinates
 */
export function pdfToScreenCoordinates(
  pdfX: number,
  pdfY: number,
  pageElement: HTMLElement,
  scale: number,
): { x: number; y: number } {
  const { left, top } = pageElement.getBoundingClientRect()

  return {
    x: left + pdfX * scale,
    y: top + pdfY * scale,
  }
}

/**
 * Converts screen coordinates to PDF coordinates
 */
export function screenToPdfCoordinates(
  screenX: number,
  screenY: number,
  pageElement: HTMLElement,
  scale: number,
): { x: number; y: number } {
  const { left, top } = pageElement.getBoundingClientRect()

  return {
    x: (screenX - left) / scale,
    y: (screenY - top) / scale,
  }
}

/**
 * Adjusts highlight position based on PDF scale
 */
export function adjustHighlightForScale(
  position: { x: number; y: number; width: number; height: number },
  scale: number,
): { x: number; y: number; width: number; height: number } {
  return {
    x: position.x * scale,
    y: position.y * scale,
    width: position.width * scale,
    height: position.height * scale,
  }
}
