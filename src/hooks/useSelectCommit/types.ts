import { Commit } from 'modules/Visualiser'

export interface SelectCommitHandler {
  selectCommitHandler: {
    onMouseOver: (commit: Commit) => void
    onMouseOut: () => void
    onClick: (commit: Commit) => void
  }
}