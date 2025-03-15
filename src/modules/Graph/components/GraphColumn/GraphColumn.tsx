import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { CSSProperties, useMemo } from 'react'
import classNames from 'classnames'

const WIDTH = 40
const HEIGHT = 40

export const GraphColumn = ({ index, state, commit }: GraphColumnProps) => {
  const { getGraphColumnColour } = useTheme()

  const columnColour = getGraphColumnColour(index)

  // console.log('isVerticalMergeLine', verticalMergeLine)
  // console.log('isCommitNode', commitNode)

  const verticalNodeLineStyles = useMemo<CSSProperties>(() => {
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

  return (
    <div style={{ height: HEIGHT }} className={styles.column}>
      {state.isNode && (
        <CommitNode
          commit={commit}
          hash={commit.hash}
          colour={columnColour}
          parents={commit.parents}
          showCommitNodeHashes={false}
        />
      )}

      {state.isVerticalMergeLine && (
        <div
          className={classNames(styles.line, styles.vertical)}
          style={{
            borderRight: `2px solid ${columnColour}`,
            ...verticalNodeLineStyles
          }}
        />
      )}

      {state.isHorizontalLine && (
        <div
          style={{
            borderTop: `2px solid ${columnColour}`,
            width: index === 0 ? '50%' : '100%'
        }}
          className={classNames(styles.line, styles.horizontal)}
        />
      )}

      {state.isLeftDownCurve && (
        <svg width="100%" height={HEIGHT} viewBox={`0 0 100 ${HEIGHT}`} className={styles.curve}>
          <path
            d={`
              M 0,${HEIGHT / 2} 
              C 50,${HEIGHT / 2} 50,${HEIGHT} 50,${HEIGHT}
            `}
            stroke={columnColour}
            fill="transparent"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  )
}