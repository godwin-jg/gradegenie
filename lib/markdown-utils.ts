export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return ""

  // This is a simple markdown to HTML converter
  // In a real implementation, you would use a library like marked or remark

  return (
    markdown
      // Headers
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
      .replace(/^##### (.*$)/gm, "<h5>$1</h5>")
      .replace(/^###### (.*$)/gm, "<h6>$1</h6>")

      // Bold and italic
      .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gm, "<em>$1</em>")

      // Lists
      .replace(/^\s*\n\* (.*)/gm, "<ul>\n<li>$1</li>")
      .replace(/^\* (.*)/gm, "<ul>\n<li>$1</li>")
      .replace(/^\s{2}\* (.*)/gm, "<ul>\n<li>$1</li>")
      .replace(/^\s{4}\* (.*)/gm, "<ul>\n<li>$1</li>")
      .replace(/<\/li>\s*<ul>/gm, "<ul>")
      .replace(/<\/ul>\s*<li>/gm, "<li>")

      // Links
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gm, '<a href="$2">$1</a>')

      // Tables
      .replace(/^\|(.+)\|$/gm, (match, content) => {
        const cells = content.split("|").map((cell) => cell.trim())
        const isHeader = cells.some((cell) => cell.includes("--"))

        if (isHeader) {
          return "" // Skip separator row
        }

        const cellsHtml = cells
          .map((cell) => {
            return `<td>${cell}</td>`
          })
          .join("")

        return `<tr>${cellsHtml}</tr>`
      })

      // Paragraphs
      .replace(/^\s*(\n)?(.+)/gm, (match, newline, content) => {
        return /^<(\/)?(h\d|ul|ol|li|table|tr|td|th|p)/.test(content) ? content : `<p>${content}</p>`
      })

      // Line breaks
      .replace(/\n/gm, "<br>")
  )
}
