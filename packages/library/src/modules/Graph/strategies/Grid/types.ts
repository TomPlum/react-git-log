import { ReactElement } from 'react'
import { Commit } from 'types/Commit'

export type CustomCommitNode = (props: CustomCommitNodeProps) => ReactElement

export interface CustomCommitNodeProps {
  commit: Commit
  colour: string
  rowIndex: number
  columnIndex: number
  nodeSize: number
  isIndexPseudoNode: boolean
}