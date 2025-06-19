import { Commit } from 'types/Commit'
import { CSSProperties } from 'react'
import { CustomTableRow } from 'modules/Table'

export interface GitLogTableRowProps {
  index: number
  commit: Commit
  row?: CustomTableRow
  rowStyleOverrides?: CSSProperties
  dataStyleOverrides?: CSSProperties
  isPlaceholder?: boolean
}