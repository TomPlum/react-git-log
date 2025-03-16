import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export interface GraphColumnData {
  columnData: Map<number, GraphColumnState[]>
  getEmptyColumnState: () => GraphColumnState[]
}