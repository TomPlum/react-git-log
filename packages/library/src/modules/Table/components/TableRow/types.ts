import { Commit } from 'types'

export interface GitLogTableRowProps {
  commit: Commit
  isPlaceholder?: boolean
}