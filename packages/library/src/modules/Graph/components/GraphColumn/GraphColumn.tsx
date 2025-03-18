import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'hooks/useTheme'
import { CSSProperties, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useGitContext } from 'context/GitContext'
import { useSelectCommit } from 'hooks/useSelectCommit'
import { ColumnBackground } from 'modules/Graph/components/ColumnBackground'
import { LeftDownCurve } from 'modules/Graph/components/LeftDownCurve'
import { LeftUpCurve } from 'modules/Graph/components/LeftUpCurve'

// TODO: Extract a bunch of stuff out of this file
export const GraphColumn = ({
  index,
  state,
  commit,
  rowIndex,
  commitNodeIndex
}: GraphColumnProps) => {
  const { selectCommitHandler } = useSelectCommit()
  const { headCommit, selectedCommit, previewedCommit, showGitLog } = useGitContext()
  const { getGraphColumnColour, shiftAlphaChannel, textColour, hoverColour, reduceOpacity } = useTheme()

  const columnColour = state.isPlaceholderSkeleton
    ? shiftAlphaChannel(textColour, 0.8)
    : getGraphColumnColour(index)

  const isRowCommitIndexNode = commit.hash === 'index'
  const indexCommitNodeBorder = shiftAlphaChannel(columnColour, 0.5)
  const rowsCommitMatchesPreviewed = previewedCommit?.hash === commit.hash
  const rowsCommitMatchesSelected = selectedCommit?.hash === commit.hash
  const rowsCommitIsHead = commit.hash === headCommit.hash && state.isNode

  // Furthest-right active branch takes precedence
  const furtherRightMergeNodeColumnIndex = state?.mergeSourceColumns
    ? Math.max(...state?.mergeSourceColumns ?? [])
    : undefined

  const verticalNodeLineStyles = useCallback<(isIndex: boolean) => CSSProperties>(isIndex => {
    // If the current column is the index pseudo-node
    // then draw a dotted line underneath it that will
    // eventually meet with the HEAD commit of the current branch.
    if (isRowCommitIndexNode) {
      return {
        top: '50%',
        height: '50%',
        zIndex: index + 1,
        borderRight: `2px dotted ${indexCommitNodeBorder}`
      }
    }

    // If this column has the HEAD commit node in it,
    // just draw a dotted line on top of it which will
    // ultimately hit the index pseudo-node above.
    if (rowsCommitIsHead) {
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
    if (isFirstCommit || state.isColumnBelowEmpty) {
      return {
        top: 0,
        height: '50%',
        zIndex: index + 1,
        borderRight: `2px solid ${columnColour}`
      }
    }

    // Border is dotted for the index pseudo-node
    // and the skeleton placeholder elements.
    const borderStyle = isIndex || state.isPlaceholderSkeleton ? 'dotted' : 'solid'

    // If this column contains a commit node, and
    // it is the tip of its branch, then just draw
    // a line underneath the node. Same goes for a
    // column that an empty one in the row above.
    const isBranchTip = commit.isBranchTip && state.isNode
    if (isBranchTip || state.isColumnAboveEmpty) {
      return {
        top: '50%',
        height: '50%',
        zIndex: index + 1,
        borderRight: `2px ${borderStyle} ${columnColour}`
      }
    }

    // If none of the above conditions are met then
    // we must be in a column with no commit node, and
    // so we draw a line the full height of the column.
    return {
      top: 0,
      height: '100%',
      zIndex: index + 1,
      borderRight: `2px ${borderStyle} ${isIndex ? indexCommitNodeBorder : columnColour}`
    }
  }, [columnColour, commit.isBranchTip, commit.parents.length, index, indexCommitNodeBorder, isRowCommitIndexNode, rowsCommitIsHead, state.isColumnAboveEmpty, state.isColumnBelowEmpty, state.isNode, state.isPlaceholderSkeleton])

  const horizontalNodeLineStyles = useMemo<CSSProperties>(() => {
    const borderColour = state.isPlaceholderSkeleton
      ? columnColour
      : getGraphColumnColour(furtherRightMergeNodeColumnIndex ?? commitNodeIndex)

    // Border is dotted for the skeleton placeholder elements.
    const borderStyle = state.isPlaceholderSkeleton ? 'dotted' : 'solid'

    // If this column has a node and is being merged into from another,
    // then we don't need to draw to the left of the node, just connect
    // to the right side horizontal line.
    if (state.isNode && state.mergeSourceColumns) {
      return {
        borderTop: `2px ${borderStyle} ${borderColour}`,
        width: '50%',
        right: 0,
        zIndex: index + 1
      }
    }

    // If no other conditions are met then we can draw a
    // full-width horizontal line.
    return {
      borderTop: `2px ${borderStyle} ${borderColour}`,
      width: index === 0 ? '50%' : '100%',
      zIndex: index + 1
    }
  }, [columnColour, commitNodeIndex, furtherRightMergeNodeColumnIndex, getGraphColumnColour, index, state.isNode, state.isPlaceholderSkeleton, state.mergeSourceColumns])

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
      {/* This column contains a node (and it's not the git index pseudo-node) */}
      {state.isNode && !isRowCommitIndexNode && (
        <CommitNode
          commit={commit}
          colour={columnColour}
        />
      )}

      {/* This column contains a node (and it's the git index pseudo-node) */}
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

      {/* This column contains a vertical branching line (full column height) */}
      {state.isVerticalLine && (
        <div
          style={verticalNodeLineStyles(false)}
          className={classNames(styles.line, styles.vertical)}
          data-testid={`vertical-line-row-${rowIndex}-col-${index}`}
        />
      )}

      {/* This column contains a vertical branching line but is the HEAD commit (So only draw below the node) */}
      {state.isVerticalLine && rowsCommitIsHead && (
        <div
          style={{
            height: '50%',
            top: '50%',
            borderRight: `2px solid ${columnColour}`
          }}
          className={classNames(styles.line, styles.vertical)}
        />
      )}

      {/* This column contains a vertical branching line but its from the HEAD commit to the index node */}
      {state.isVerticalIndexLine && (
        <div
          style={verticalNodeLineStyles(true)}
          className={classNames(styles.line, styles.vertical)}
        />
      )}

      {/* This column contains a horizontal branching line (full column width) */}
      {state.isHorizontalLine && (
        <div
          style={horizontalNodeLineStyles}
          className={classNames(styles.line, styles.horizontal)}
        />
      )}

      {/* This column is part of a row that has been selected */}
      {showSelectedBackground && (
        <ColumnBackground
          index={index}
          commitNodeIndex={commitNodeIndex}
          colour={reduceOpacity(getGraphColumnColour(commitNodeIndex), 0.15)}
        />
      )}

      {/* This column is part of a row that has been previewed (via hover) */}
      {showPreviewBackground && (
        <ColumnBackground
          index={index}
          colour={hoverColour}
          commitNodeIndex={commitNodeIndex}
        />
      )}

      {/* This column is part of a merge or branching and requires a curve (left edge to bottom edge) */}
      {state.isLeftDownCurve && (
        <LeftDownCurve
          color={columnColour}
          isPlaceholder={state.isPlaceholderSkeleton}
        />
      )}

      {/* This column is part of a merge or branching and requires a curve (left edge to top edge) */}
      {state.isLeftUpCurve && (
        <LeftUpCurve
          color={columnColour}
          isPlaceholder={state.isPlaceholderSkeleton}
        />
      )}
    </div>
  )
}