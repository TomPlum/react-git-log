import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { CSSProperties, useCallback } from 'react'
import classNames from 'classnames'
import { useGitContext } from 'modules/Visualiser/context'
import { FadingDiv } from 'components/FadingDiv'

// TODO: Source high from a prop once exposed
const HEIGHT = 40

export const GraphColumn = ({ index, state, commit, commitNodeIndex }: GraphColumnProps) => {
  const { headCommit, selectedCommit, previewedCommit } = useGitContext()
  const { getGraphColumnColour, shiftAlphaChannel, reduceOpacity, hoverColour } = useTheme()

  const columnColour = getGraphColumnColour(index)

  const verticalNodeLineStyles = useCallback<(isIndex: boolean) => CSSProperties>(isIndex => {
    if (commit.hash === 'index') {
      return {
        height: '50%',
        top: '50%',
        borderRight: `2px dotted ${columnColour}`
      }
    }

    const borderStyle = isIndex ? 'dotted' : 'solid'

    if (commit.hash === headCommit.hash && state.isNode) {
      return {
        height: '50%',
        top: 0,
        borderRight: `2px dotted ${columnColour}`
      }
    }

    if (commit.isBranchTip && state.isNode) {
      return {
        height: '50%',
        top: '50%',
        borderRight: `2px ${borderStyle} ${columnColour}`
      }
    }

    return {
      height: '100%',
      top: 0,
      borderRight: `2px ${borderStyle} ${columnColour}`
    }
  }, [columnColour, commit.hash, commit.isBranchTip, headCommit.hash, state.isNode])

  return (
    <div className={styles.column} id={`graph_column_${index}_${commit.hash}`}>
      {state.isNode && commit && (
        <CommitNode
          commit={commit}
          colour={columnColour}
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
          style={verticalNodeLineStyles(false)}
          className={classNames(styles.line, styles.vertical)}
        />
      )}

      {state.isVerticalMergeLine && commit.hash === headCommit.hash && (
        <>
          <div
            style={verticalNodeLineStyles(false)}
            className={classNames(styles.line, styles.vertical)}
          />

          <div
            style={{
              height: '50%',
              top: '50%',
              borderRight: `2px solid ${columnColour}`
            }}
            className={classNames(styles.line, styles.vertical)}
          />
        </>
      )}

      {state.isVerticalIndexLine && (
        <div
          style={verticalNodeLineStyles(true)}
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

      {selectedCommit?.hash === commit.hash && (
        <div
          className={classNames(
            { [styles.selectedBackground]: index > commitNodeIndex },
            { [styles.selectedBackgroundBehindNode]: index === commitNodeIndex }
          )}
          style={{
            background: reduceOpacity(getGraphColumnColour(commitNodeIndex), 0.15)
          }}
        />
      )}

      {previewedCommit?.hash === commit.hash && (
        <FadingDiv
          className={classNames(
            { [styles.selectedBackground]: index > commitNodeIndex },
            { [styles.selectedBackgroundBehindNode]: index === commitNodeIndex }
          )}
          style={{
            background: hoverColour
          }}
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