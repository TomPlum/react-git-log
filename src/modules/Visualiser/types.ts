export interface VisualiserProps {
  showBranchesTags?: boolean;
  entries: GitLogEntry[]
}

export interface Commit {
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
  isBranchTip?: boolean
}