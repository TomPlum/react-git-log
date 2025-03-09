import { Commit } from 'modules/Visualiser'

export interface CommitNodeProps {
  x: number
  y: number
  hash: string
  parents: string[]
  commit: Commit
  showCommitNodeHashes: boolean
}