import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { CSSProperties, useMemo } from 'react'
import classNames from 'classnames'

// TODO: Source high from a prop once exposed
const HEIGHT = 40

export const GraphColumn = ({ index, state, commit }: GraphColumnProps) => {
  const { getGraphColumnColour, shiftAlphaChannel } = useTheme()

  const columnColour = getGraphColumnColour(index)

  const verticalNodeLineStyles = useMemo<CSSProperties>(() => {
    if (commit.hash === 'index') {
      return {
        height: '50%',
        top: '50%',
        borderRight: `2px dotted ${columnColour}`
      }
    }

    if (commit.isBranchTip) {
      return {
        height: '50%',
        top: '50%',
        borderRight: `2px solid ${columnColour}`
      }
    }

    return {
      height: '100%',
      top: 0,
      borderRight: `2px solid ${columnColour}`
    }
  }, [columnColour, commit])

  return (
    <div className={styles.column} id={`graph_column_${index}_${commit.hash}`}>
      {state.isNode && commit && (
        <CommitNode
          commit={commit}
          hash={commit.hash}
          colour={columnColour}
          parents={commit.parents}
          showCommitNodeHashes={false}
        />
      )}

      {state.isNode && !commit && (
        <div
          className={styles.indexNode}
          style={{
            border: `2px dotted ${shiftAlphaChannel(columnColour, 0.5)}`,
            backgroundColor: shiftAlphaChannel(columnColour, 0.05),
          }}
        />
      )}

      {state.isVerticalMergeLine && (
        <div
          style={verticalNodeLineStyles}
          className={classNames(styles.line, styles.vertical)}
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

   {/*   {state.isHorizontalLine && state.isVerticalMergeLine && !state.isNode && (
        <div
          className={styles.mergeNode}
          style={{
            backgroundColor: columnColour,
          }}
        />
      )}*/}

      {state.isLeftDownCurve && (
        <svg width="100%" height={HEIGHT} viewBox={`0 0 100 ${HEIGHT}`} className={styles.curve}>
          <path
            d={`
              M 0,${(HEIGHT / 2) + 3} 
              C 50,${HEIGHT / 2} 50,${HEIGHT} 50,${HEIGHT + 20}
            `}
            stroke={columnColour}
            fill="transparent"
            strokeWidth="4"
          />
        </svg>
      )}

      {state.isLeftUpCurve && (
        <svg width="100%" height={HEIGHT} viewBox={`0 0 100 ${HEIGHT}`} className={styles.curve}>
          <path
            d={`
              M 0,${(HEIGHT / 2) + 3} 
              C 50,${HEIGHT / 2} 50,0 50,-20
            `}
            stroke={columnColour}
            fill="transparent"
            strokeWidth="4"
          />
        </svg>
      )}
    </div>
  )
}