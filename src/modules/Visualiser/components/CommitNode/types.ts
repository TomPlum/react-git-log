import { Commit } from 'modules/Visualiser'

export interface CommitNodeProps {
  x: number
  y: number
  hash: string
  parents: string[]
  color?: string
  commit: Commit
  onClick: (commit: Commit) => void
  showCommitNodeHashes: boolean
}