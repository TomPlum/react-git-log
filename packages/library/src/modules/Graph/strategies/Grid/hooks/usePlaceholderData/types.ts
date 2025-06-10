import { Commit } from 'types/Commit'
import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'

export interface PlaceholderDatum {
  commit: Commit
  columns: GraphColumnState[]
}

export interface PlaceholderData {
  placeholderData: PlaceholderDatum[]
}