export interface Position {
  x: number
  y: number
  width: number
  height: number
}

export interface Highlight {
  id: string
  text: string
  pageIndex: number
  position: Position
  color: string
}

export interface Comment {
  id: string
  text: string
  highlight: Highlight
  author: string
  timestamp: string
  isAIGenerated: boolean
}
