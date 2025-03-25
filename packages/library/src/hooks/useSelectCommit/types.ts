import { Commit } from 'types/Commit'

export interface SelectCommitHandler {
  selectCommitHandler: {
    onMouseOver: (commit: Commit) => void
    onMouseOut: () => void
    onClick: (commit: Commit) => void
  }
}