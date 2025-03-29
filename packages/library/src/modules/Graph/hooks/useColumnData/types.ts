import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export interface GraphColumnDataProps {
  visibleCommits: number
}

export interface GraphColumnData {
  columnData: Map<number, GraphColumnState[]>
  virtualColumns: number
  getEmptyColumnState: () => GraphColumnState[]
}