import { Commit } from 'modules/Visualiser'

export interface CommitNodeProps {
  hash: string
  colour: string
  parents: string[]
  commit: Commit
  showCommitNodeHashes: boolean
}