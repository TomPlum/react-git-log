import { Commit } from 'types/Commit'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export interface PlaceholderDatum {
  commit: Commit
  columns: GraphColumnState[]
}

export interface PlaceholderData {
  placeholderData: PlaceholderDatum[]
}