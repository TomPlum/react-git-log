import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { CSSProperties, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useGitContext } from 'modules/Visualiser/context'
import { FadingDiv } from 'components/FadingDiv'
import { useSelectCommit } from 'modules/Visualiser/hooks/useSelectCommit'

// TODO: Source high from a prop once exposed
const HEIGHT = 40

export const GraphColumn = ({
  index,
  state,
  commit,
  commitNodeIndex
}: GraphColumnProps) => {
  const { selectCommitHandler } = useSelectCommit()
  const { headCommit, selectedCommit, previewedCommit, showGitLog } = useGitContext()
  const { getGraphColumnColour, shiftAlphaChannel, reduceOpacity, hoverColour } = useTheme()

  const columnColour = getGraphColumnColour(index)
  const isRowCommitIndexNode = commit.hash === 'index'
  const indexCommitNodeBorder = shiftAlphaChannel(columnColour, 0.5)
  const rowsCommitMatchesPreviewed = previewedCommit?.hash === commit.hash
  const rowsCommitMatchesSelected = selectedCommit?.hash === commit.hash
  const rowsCommitIsHead = commit.hash === headCommit.hash

  const verticalNodeLineStyles = useCallback<(isIndex: boolean) => CSSProperties>(isIndex => {
    // If the current column is the index pseudo-node
    // then draw a dotted line underneath it that will
    // eventually meet with the HEAD commit of the current branch.
    if (isRowCommitIndexNode) {
      return {
        height: '50%',
        top: '50%',
        borderRight: `2px dotted ${indexCommitNodeBorder}`
      }
    }

    // If this column has the HEAD commit node in it,
    // just draw a dotted line on top of it which will
    // ultimately hit the index pseudo-node above.
    if (rowsCommitIsHead && state.isNode) {
      return {
        height: '50%',
        top: 0,
        borderRight: `2px dotted ${indexCommitNodeBorder}`
      }
    }

    // If this column has a commit node in it, and it
    // has no parents, then it must be the first commit
    // in the graph, so just draw a solid line above it.
    const isFirstCommit = state.isNode && commit.parents.length === 0
    // Or if we're a merge target node that closed a branch
    // const isMergeTarget = state.isNode && state.mergeSourceNodeColumnIndex // TODO: Are we gonna use this?
    if (isFirstCommit) {
      return {
        height: '50%',
        top: 0,
        borderRight: `2px solid ${columnColour}`
      }
    }

    // Border is dotted for the index pseudo-node
    const borderStyle = isIndex ? 'dotted' : 'solid'

    // If this column contains a commit node, and
    // it is the tip of its branch, then just draw
    // a line underneath the node
    if (commit.isBranchTip && state.isNode) {
      return {
        height: '50%',
        top: '50%',
        borderRight: `2px ${borderStyle} ${columnColour}`
      }
    }

    // If none of the above conditions are met then
    // we must be in a column with no commit node, and
    // so we draw a line the full height of the column.
    return {
      height: '100%',
      top: 0,
      borderRight: `2px ${borderStyle} ${isIndex ? indexCommitNodeBorder : columnColour}`
    }
  }, [columnColour, commit.isBranchTip, commit.parents.length, indexCommitNodeBorder, isRowCommitIndexNode, rowsCommitIsHead, state.isNode])

  const horizontalNodeLineStyles = useMemo<CSSProperties>(() => {
    const borderColour = getGraphColumnColour(state.mergeSourceNodeColumnIndex ?? commitNodeIndex)

    // If this column has a node and is being merged into from another,
    // then we don't need to draw to the left of the node, just connect
    // to the right side horizontal line.
    if (state.isNode && state.mergeSourceNodeColumnIndex) {
      return {
        borderTop: `2px solid ${borderColour}`,
        width: '50%',
        right: 0,
        zIndex: index
      }
    }

    // If no other conditions are met then we can draw a
    // full-width horizontal line.
    return {
      borderTop: `2px solid ${borderColour}`,
      width: index === 0 ? '50%' : '100%',
      zIndex: index
    }
  }, [commitNodeIndex, getGraphColumnColour, index, state.isNode, state.mergeSourceNodeColumnIndex])

  const showPreviewBackground = useMemo(() => {
    const selectedCommitIsNotPreviewed = selectedCommit?.hash != previewedCommit?.hash
    const shouldPreview = rowsCommitMatchesPreviewed && selectedCommitIsNotPreviewed

    if (showGitLog) {
      return shouldPreview
    }

    // If the log is not rendered on the right, only
    // show the preview background for the node column
    return shouldPreview && commitNodeIndex === index
  }, [commitNodeIndex, index, previewedCommit?.hash, rowsCommitMatchesPreviewed, selectedCommit?.hash, showGitLog])

  const showSelectedBackground = useMemo(() => {
    if (showGitLog) {
      return rowsCommitMatchesSelected
    }

    // If the log is not rendered on the right, only
    // show the selected background for the node column
    return rowsCommitMatchesSelected && commitNodeIndex === index
  }, [commitNodeIndex, index, rowsCommitMatchesSelected, showGitLog])

  return (
    <div
      className={styles.column}
      id={`graph_column_${index}_${commit.hash}`}
      onMouseOut={() => selectCommitHandler.onMouseOut()}
      onClick={() => selectCommitHandler.onClick(commit)}
      onMouseOver={() => selectCommitHandler.onMouseOver(commit)}
    >
      {state.isNode && !isRowCommitIndexNode && (
        <CommitNode
          commit={commit}
          colour={columnColour}
          showCommitNodeHashes={false}
        />
      )}

      {state.isNode && isRowCommitIndexNode && (
        <div
          className={classNames(
            styles.indexNode,
            { [styles.spin]: (rowsCommitMatchesPreviewed || rowsCommitMatchesSelected) },
          )}
          style={{
            border: `2px dotted ${shiftAlphaChannel(columnColour, 0.5)}`,
            backgroundColor: shiftAlphaChannel(columnColour, 0.05),
          }}
        />
      )}

      {state.isVerticalLine && (
        <div
          style={verticalNodeLineStyles(false)}
          className={classNames(styles.line, styles.vertical)}
        />
      )}

      {state.isVerticalLine && rowsCommitIsHead && (
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
          style={horizontalNodeLineStyles}
          className={classNames(styles.line, styles.horizontal)}
        />
      )}

      {showSelectedBackground && (
        <div
          className={classNames(
            styles.selectedBackground,
            { [styles.noLogBackground]: !showGitLog },
            { [styles.selectedBackgroundSquare]: index > commitNodeIndex },
            { [styles.selectedBackgroundBehindNode]: index === commitNodeIndex }
          )}
          style={{
            background: reduceOpacity(getGraphColumnColour(commitNodeIndex), 0.15)
          }}
        />
      )}

      {showPreviewBackground && (
        <FadingDiv
          className={classNames(
            styles.selectedBackground,
            { [styles.noLogBackground]: !showGitLog },
            { [styles.selectedBackgroundSquare]: index > commitNodeIndex },
            { [styles.selectedBackgroundBehindNode]: index === commitNodeIndex }
          )}
          style={{
            background: hoverColour
          }}
        />
      )}

      {state.isLeftDownCurve && (
        <svg width="100%" height={HEIGHT} viewBox={`0 0 100 ${HEIGHT}`} className={styles.curve}>
          <path
            d={`
              M 0,${(HEIGHT / 2) + 1} 
              C 53,${HEIGHT / 2} 53,${HEIGHT} 50,${HEIGHT + 20}
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
              M 0,${(HEIGHT / 2) + 2} 
              C 46,${HEIGHT / 2} 53,0 50,-50
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