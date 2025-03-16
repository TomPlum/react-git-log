import { Commit } from 'modules/Visualiser'

export interface CommitNodeProps {
  colour: string
  commit: Commit
  showCommitNodeHashes: boolean
}