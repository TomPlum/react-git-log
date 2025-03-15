import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { CSSProperties, useMemo } from 'react'

const SIZE = 40

export const GraphColumn = ({ index, state, commit }: GraphColumnProps) => {
  const { getGraphColumnColour } = useTheme()

  const columnColour = getGraphColumnColour(index)

  // console.log('isVerticalMergeLine', verticalMergeLine)
  // console.log('isCommitNode', commitNode)

  const nodeLineStyles = useMemo<CSSProperties>(() => {
    if (commit.parents.length > 0) {
      return {
        height: '100%',
        top: 0
      }
    }

    return {
      height: '50%',
      top: '50%'
    }
  }, [commit.parents.length])

  if (state.isVerticalMergeLine && state.isStartNode) {
    return (
      <div style={{ width: SIZE, height: SIZE }} className={styles.column}>
        <CommitNode
          commit={commit}
          hash={commit.hash}
          colour={columnColour}
          parents={commit.parents}
          showCommitNodeHashes={false}
        />

        <div
          className={styles.line}
          style={{
            borderRight: `2px solid ${columnColour}`,
            ...nodeLineStyles
          }}
        />
      </div>
    )
  }

  if (state.isVerticalMergeLine) {
    return (
      <div style={{ width: SIZE, height: SIZE }} className={styles.column}>
        <div
          className={styles.singularLine}
          style={{ borderRight: `2px solid ${columnColour}` }}
        />
      </div>
    )
  }

  if (state.isStartNode) {
    return (
      <div style={{ width: SIZE, height: SIZE }} className={styles.column}>
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
      style={{ width: SIZE, height: SIZE }}
    />
  )
}