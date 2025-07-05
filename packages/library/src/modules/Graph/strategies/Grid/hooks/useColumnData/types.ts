import { GraphMatrixColumns } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrixColumns'

export interface GraphColumnDataProps {
  visibleCommits: number
}

export type RowIndexToColumnStates = Map<number, GraphMatrixColumns>

export interface GraphColumnData {
  columnData: RowIndexToColumnStates
  virtualColumns: number
}