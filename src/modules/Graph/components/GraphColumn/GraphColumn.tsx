import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'

export const GraphColumn = ({ index, state, commit }: GraphColumnProps) => {
  const { getGraphColumnColour } = useTheme()

  const columnColour = getGraphColumnColour(index)

  // console.log('isVerticalMergeLine', verticalMergeLine)
  // console.log('isCommitNode', commitNode)

  if (state.isVerticalMergeLine && state.isStartNode) {
    return (
      <div style={{ width: 30, height: 30 }} className={styles.column}>
        <CommitNode
          commit={commit}
          hash={commit.hash}
          colour={columnColour}
          parents={commit.parents}
          showCommitNodeHashes={false}
        />

        <div
          className={styles.line}
          style={{ borderRight: `2px solid ${columnColour}` }}
        />
      </div>
    )
  }

  if (state.isVerticalMergeLine) {
    return (
      <div style={{ width: 30, height: 30 }} className={styles.column}>
        <div
          className={styles.singularLine}
          style={{ borderRight: `2px solid ${columnColour}` }}
        />
      </div>
    )
  }

  if (state.isStartNode) {
    return (
      <div style={{ width: 30, height: 30 }} className={styles.column}>
        <CommitNode
          commit={commit}
          hash={commit.hash}
          colour={columnColour}
          parents={commit.parents}
          showCommitNodeHashes={false}
        />
      </div>
    )
  }

  return (
    <div
      className={styles.column}
      style={{ width: 30, height: 30 }}
    />
  )
}