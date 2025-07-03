import { CommitNodeLocation } from 'data'
import { Commit } from 'types/Commit'

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
  check: () => boolean
  position: GraphBreakPointPosition
}

export type GraphBreakPointPosition = 'top' | 'bottom'