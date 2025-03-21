import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export interface HorizontalLineProps {
  columnIndex: number
  commitNodeIndex: number
  columnColour: string
  state: GraphColumnState
}