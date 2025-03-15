import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'

export const GraphColumn = ({ empty, commit }: GraphColumnProps) => {
  if (empty) {
    return (
      <div
        className={styles.column}
        style={{ width: 30, height: 30 }}
      />
    )
  }

  return (
    <div style={{ width: 30, height: 30 }} className={styles.column}>
      <CommitNode hash={commit.hash} parents={commit.parents} commit={commit} showCommitNodeHashes={false} />
    </div>
  )
}