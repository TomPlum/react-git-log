import { Commit } from 'types/Commit'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export interface GraphRowProps {
  id: number
  commit: Commit
  width: number
  columns: GraphColumnState[]
}