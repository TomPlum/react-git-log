import { GraphColumnState } from 'modules/Graph/components/GraphColumn'
import { Commit } from 'types'

export interface VerticalLineProps {
  state: GraphColumnState
  columnIndex: number
  columnColour: string
  commit: Commit
  indexCommitNodeBorder: string
}