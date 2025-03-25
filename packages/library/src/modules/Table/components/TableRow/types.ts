import { Commit } from 'types/Commit'

export interface GitLogTableRowProps {
  index: number
  commit: Commit
  isPlaceholder?: boolean
}