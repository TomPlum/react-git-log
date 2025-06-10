import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { Commit } from 'types/Commit'

export interface VerticalLineProps {
  isIndex: boolean
  state: GraphColumnState
  columnIndex: number
  columnColour: string
  commit: Commit
  indexCommitNodeBorder: string
}