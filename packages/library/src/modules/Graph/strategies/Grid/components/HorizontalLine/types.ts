import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'

export interface HorizontalLineProps {
  columnIndex: number
  commitNodeIndex: number
  columnColour: string
  state: GraphColumnState
}