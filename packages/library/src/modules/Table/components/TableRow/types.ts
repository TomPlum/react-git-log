import { Commit } from 'types/Commit'
import { CSSProperties } from 'react'

export interface GitLogTableRowProps {
  index: number
  commit: Commit
  rowStyleOverrides?: CSSProperties
  dataStyleOverrides?: CSSProperties
  isPlaceholder?: boolean
}