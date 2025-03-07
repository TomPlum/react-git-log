export interface VisualiserProps {
  entries: GitLogEntry[]
}

export interface CommitNode {
  hash: string
  parents: string[]
  refs: string
  message: string
  x: number
  y: number
}

export interface GitLogEntry {
  hash: string
  branch: string
  parents: string[]
  refs: string
  message: string
  date: string
}