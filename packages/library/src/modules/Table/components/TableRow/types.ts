import { Commit } from 'types'

export interface GitLogTableRowProps {
  index: number
  commit: Commit
  isPlaceholder?: boolean
}