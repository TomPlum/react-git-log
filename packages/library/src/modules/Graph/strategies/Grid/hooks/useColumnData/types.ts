import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'

export interface GraphColumnDataProps {
  visibleCommits: number
}

export type RowIndexToColumnStates = Map<number, GraphColumnState[]>

export interface GraphColumnData {
  columnData: RowIndexToColumnStates
  virtualColumns: number
  getEmptyColumnState: () => GraphColumnState[]
}