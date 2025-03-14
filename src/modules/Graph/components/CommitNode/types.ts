import { Commit } from 'modules/Visualiser'

export interface CommitNodeProps {
  hash: string
  parents: string[]
  commit: Commit
  showCommitNodeHashes: boolean
}