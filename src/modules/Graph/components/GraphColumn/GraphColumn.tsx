import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'

export const GraphColumn = ({ empty, commit }: GraphColumnProps) => {
  if (empty) {
    return (
      <div
        style={{ width: 30, height: 30 }}
      />
    )
  }

  return (
    <div style={{ width: 30, height: 30 }}>
      <CommitNode hash={commit.hash} parents={commit.parents} commit={commit} showCommitNodeHashes={false} />
    </div>
  )
}