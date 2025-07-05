import { CommitNodeLocation } from 'data'
import { Commit } from 'types/Commit'
import { GraphMatrix } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder/GraphMatrix'

export interface GraphMatrixBuilderProps {
  graphWidth: number
  commits: Commit[]
  positions: Map<string, CommitNodeLocation>
  visibleCommits: number
  headCommit?: Commit
  headCommitHash?: string
  isIndexVisible: boolean
}

export interface GraphBreakPointCheck {
  location: CommitNodeLocation
  check: (matrix: GraphMatrix) => boolean
  position: GraphBreakPointPosition
}

export type GraphBreakPointPosition = 'top' | 'bottom'