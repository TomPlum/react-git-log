import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'hooks/useTheme'
import { CSSProperties, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useGitContext } from 'context'
import { FadingDiv } from 'components/FadingDiv'
import { useSelectCommit } from 'hooks/useSelectCommit'
import { ROW_HEIGHT } from 'constants.ts'

// TODO: Extract a bunch of stuff out of this file
export const GraphColumn = ({
  index,
  state,
  commit,
  commitNodeIndex
}: GraphColumnProps) => {
  const { selectCommitHandler } = useSelectCommit()
  const { headCommit, selectedCommit, previewedCommit, showGitLog, rowSpacing } = useGitContext()
  const { getGraphColumnColour, shiftAlphaChannel, reduceOpacity, hoverColour, textColour } = useTheme()

  const columnColour = state.isPlaceholderSkeleton
    ? shiftAlphaChannel(textColour, 0.8)
    : getGraphColumnColour(index)

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
    // and the skeleton placeholder elements.
    const borderStyle = isIndex || state.isPlaceholderSkeleton ? 'dotted' : 'solid'

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
  }, [columnColour, commit.isBranchTip, commit.parents.length, indexCommitNodeBorder, isRowCommitIndexNode, rowsCommitIsHead, state.isNode, state.isPlaceholderSkeleton])

  const horizontalNodeLineStyles = useMemo<CSSProperties>(() => {
    const borderColour = state.isPlaceholderSkeleton
      ? columnColour
      : getGraphColumnColour(state.mergeSourceNodeColumnIndex ?? commitNodeIndex)

    // Border is dotted for the skeleton placeholder elements.
    const borderStyle = state.isPlaceholderSkeleton ? 'dotted' : 'solid'

    // If this column has a node and is being merged into from another,
    // then we don't need to draw to the left of the node, just connect
    // to the right side horizontal line.
    if (state.isNode && state.mergeSourceNodeColumnIndex) {
      return {
        borderTop: `2px ${borderStyle} ${borderColour}`,
        width: '50%',
        right: 0,
        zIndex: index
      }
    }

    // If no other conditions are met then we can draw a
    // full-width horizontal line.
    return {
      borderTop: `2px ${borderStyle} ${borderColour}`,
      width: index === 0 ? '50%' : '100%',
      zIndex: index
    }
  }, [columnColour, commitNodeIndex, getGraphColumnColour, index, state.isNode, state.isPlaceholderSkeleton, state.mergeSourceNodeColumnIndex])

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

  const selectedBackgroundStyles = useMemo<CSSProperties>(() => {
    const NODE_SIZE = 24 // TODO: Source dynamically once prop exposed

    if (index === commitNodeIndex) {
      return {
        height: ROW_HEIGHT,
        width: `calc(50% + ${NODE_SIZE}px)`,
        background: reduceOpacity(getGraphColumnColour(commitNodeIndex), 0.15)
      }
    }

    return {
      height: ROW_HEIGHT,
      background: reduceOpacity(getGraphColumnColour(commitNodeIndex), 0.15)
    }
  }, [commitNodeIndex, getGraphColumnColour, index, reduceOpacity])

  const previewedBackgroundStyles = useMemo<CSSProperties>(() => {
    const NODE_SIZE = 24 // TODO: Source dynamically once prop exposed

    if (index === commitNodeIndex) {
      return {
        width: `calc(50% + ${NODE_SIZE}px)`,
        background: hoverColour,
        height: ROW_HEIGHT
      }
    }

    return {
      height: ROW_HEIGHT,
      background: hoverColour
    }
  }, [commitNodeIndex, hoverColour, index])

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
          style={selectedBackgroundStyles}
          className={classNames(
            styles.selectedBackground,
            { [styles.noLogBackground]: !showGitLog },
            { [styles.selectedBackgroundSquare]: index > commitNodeIndex },
            { [styles.selectedBackgroundBehindNode]: index === commitNodeIndex }
          )}
        />
      )}

      {showPreviewBackground && (
        <FadingDiv
          style={previewedBackgroundStyles}
          className={classNames(
            styles.selectedBackground,
            { [styles.noLogBackground]: !showGitLog },
            { [styles.selectedBackgroundSquare]: index > commitNodeIndex },
            { [styles.selectedBackgroundBehindNode]: index === commitNodeIndex }
          )}
        />
      )}

      {state.isLeftDownCurve && (
        <svg width="100%" height={ROW_HEIGHT + rowSpacing} viewBox={'0 0 100 100'} className={styles.curve} preserveAspectRatio='none'>
          <path
            d={`
              M 0,51
              A 50,50 0 0,1 50,100
            `}
            stroke={columnColour}
            fill="transparent"
            strokeWidth="2"
            vectorEffect='non-scaling-stroke'
            strokeDasharray={state.isPlaceholderSkeleton ? '3 4': undefined}
          />
        </svg>
      )}

      {state.isLeftUpCurve && (
        <svg width="100%" height={ROW_HEIGHT + rowSpacing} viewBox={'0 0 100 100'} className={styles.curve} preserveAspectRatio='none'>
          <path
            d={`
              M 0,52 
              A 50,50 0 0,0 50,0
            `}
            stroke={columnColour}
            strokeDasharray={state.isPlaceholderSkeleton ? '3 4': undefined}
            fill="transparent"
            vectorEffect='non-scaling-stroke'
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  )
}