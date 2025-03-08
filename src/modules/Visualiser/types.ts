export interface VisualiserProps {
  showBranchesTags?: boolean;
  entries: GitLogEntry[]
}

export interface Commit {
  hash: string
  parents: string[]
  refs: string
  branch: string
  message: string
  x: number
  y: number
  date: string
  isBranchTip: boolean
}

export interface GitLogEntry {
  hash: string
  branch: string
  parents: string[]
  refs: string
  message: string
  date: string
}

export const ROW_HEIGHT = 48

export const colours: Record<number, string> = {
  0: 'rgb(242, 94, 53)',
  1: 'rgb(102, 245, 83)',
  2: 'rgb(83,183,245)',
  3: 'rgb(245,237,83)',
  4: 'rgb(245,159,57)',
  5: 'rgb(240,83,245)',
  6: 'rgb(150,56,241)'
}