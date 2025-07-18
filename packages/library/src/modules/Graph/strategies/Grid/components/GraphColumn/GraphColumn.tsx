import { GraphColumnProps } from './types'
import { CommitNode } from 'modules/Graph/strategies/Grid/components/CommitNode'
import styles from './GraphColumn.module.scss'
import { useTheme } from 'hooks/useTheme'
import { CSSProperties, useMemo } from 'react'
import { useGitContext } from 'context/GitContext'
import { useSelectCommit } from 'hooks/useSelectCommit'
import { ColumnBackground } from 'modules/Graph/strategies/Grid/components/ColumnBackground'
import { LeftDownCurve } from 'modules/Graph/strategies/Grid/components/LeftDownCurve'
import { LeftUpCurve } from 'modules/Graph/strategies/Grid/components/LeftUpCurve'
import { HorizontalLine } from 'modules/Graph/strategies/Grid/components/HorizontalLine'
import { VerticalLine } from 'modules/Graph/strategies/Grid/components/VerticalLine'
import { HeadCommitVerticalLine } from 'modules/Graph/strategies/Grid/components/HeadCommitVerticalLine'
import { IndexPseudoCommitNode } from 'modules/Graph/strategies/Grid/components/IndexPseudoCommitNode'
import { useGraphContext } from 'modules/Graph/context'

export const GraphColumn = ({
  index,
  rowIndex,
  state,
  commit,
  commitNodeIndex
}: GraphColumnProps) => {
  const { selectCommitHandler } = useSelectCommit()
  const { nodeSize, orientation, node } = useGraphContext()
  const { getGraphColumnColour, shiftAlphaChannel, textColour, hoverColour, getGraphColumnSelectedBackgroundColour } = useTheme()

  const {
    showTable,
    headCommit,
    selectedCommit,
    previewedCommit,
    enableSelectedCommitStyling,
    enablePreviewedCommitStyling
  } = useGitContext()

  const columnColour = state.isPlaceholderSkeleton
    ? shiftAlphaChannel(textColour, 0.8)
    : getGraphColumnColour(index)

  const isRowCommitIndexNode = commit.hash === 'index'
  const indexCommitNodeBorder = shiftAlphaChannel(columnColour, 0.5)
  const rowsCommitMatchesPreviewed = previewedCommit?.hash === commit.hash
  const rowsCommitMatchesSelected = selectedCommit?.hash === commit.hash
  const rowsCommitIsHead = commit.hash === headCommit?.hash && state.isNode
  
  const showPreviewBackground = useMemo(() => {
    if (!enablePreviewedCommitStyling) {
      return false
    }

    const selectedCommitIsNotPreviewed = selectedCommit?.hash != previewedCommit?.hash
    const shouldPreview = rowsCommitMatchesPreviewed && selectedCommitIsNotPreviewed

    // If we're rendering the table on the right, then we
    // want all columns in this row to render a background
    // so that it lines up with the table row.
    if (showTable) {
      return shouldPreview
    }

    // If the table is not rendered on the right, only
    // show the preview background for the node column
    return shouldPreview && commitNodeIndex === index
  }, [commitNodeIndex, enablePreviewedCommitStyling, index, previewedCommit?.hash, rowsCommitMatchesPreviewed, selectedCommit?.hash, showTable])

  const showSelectedBackground = useMemo(() => {
    if (!enableSelectedCommitStyling) {
      return false
    }

    // If we're rendering the table on the right, then we
    // want all columns in this row to render a background
    // so that it lines up with the table row.
    if (showTable) {
      return rowsCommitMatchesSelected
    }

    // If the table is not rendered on the right, only
    // show the selected background for the node column
    return rowsCommitMatchesSelected && commitNodeIndex === index
  }, [commitNodeIndex, enableSelectedCommitStyling, index, rowsCommitMatchesSelected, showTable])

  const style = useMemo<CSSProperties>(() => {
    const isCurve = state.isLeftDownCurve || state.isLeftUpCurve

    if (orientation === 'flipped' && isCurve) {
      return {
        minWidth: nodeSize,
        transform:'scale(-1, 1)'
      }
    }

    return {
      minWidth: nodeSize,
    }
  }, [nodeSize, orientation, state.isLeftDownCurve, state.isLeftUpCurve])

  const CustomCommitNode = node?.({
    commit,
    nodeSize,
    rowIndex,
    columnIndex: index,
    isIndexPseudoNode: isRowCommitIndexNode,
    colour: isRowCommitIndexNode ? shiftAlphaChannel(columnColour, 0.5) : columnColour,
  })

  const handleMouseOut = () => {
    selectCommitHandler.onMouseOut()
  }

  const handleClick = () => {
    selectCommitHandler.onClick(commit)
  }

  const handleMouseOver = () => {
    selectCommitHandler.onMouseOver(commit)
  }

  return (
    <button
      style={style}
      tabIndex={rowIndex}
      onClick={handleClick}
      onBlur={handleMouseOut}
      onFocus={handleMouseOver}
      className={styles.column}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
      id={`graph-column-row-${rowIndex}-col-${index}`}
      data-testid={`graph-column-row-${rowIndex}-col-${index}`}
    >
      {/* This column contains a node (and it's not the git index pseudo-node) */}
      {state.isNode && !isRowCommitIndexNode && (
        CustomCommitNode ?? (
          <CommitNode
            commit={commit}
            colour={columnColour}
          />
        )
      )}

      {/* This column contains a node (and it's the git index pseudo-node) */}
      {state.isNode && isRowCommitIndexNode && (
        CustomCommitNode ?? (
          <IndexPseudoCommitNode
            columnColour={columnColour}
            animate={rowsCommitMatchesPreviewed || rowsCommitMatchesSelected}
          />
        )
      )}

      {/* This column contains the HEAD commit, so only draw below a vertical line below the node */}
      {state.isVerticalLine && rowsCommitIsHead && (
        <HeadCommitVerticalLine
          columnColour={columnColour}
        />
      )}

      {/* This column contains a vertical branching line (full column height) */}
      {/* OR - This column contains a vertical branching line, but its from the HEAD commit to the index node */}
      {state.isVerticalLine && (
        <VerticalLine
          state={state}
          commit={commit}
          columnIndex={index}
          columnColour={columnColour}
          isIndex={state.isVerticalIndexLine ?? false}
          indexCommitNodeBorder={indexCommitNodeBorder}
        />
      )}

      {/* This column contains a horizontal branching line (full column width) */}
      {state.isHorizontalLine && (
        <HorizontalLine
          state={state}
          columnIndex={index}
          columnColour={columnColour}
          commitNodeIndex={commitNodeIndex}
        />
      )}

      {/* This column is part of a row that has been selected */}
      {showSelectedBackground && (
        <ColumnBackground
          id='selected'
          index={index}
          commitNodeIndex={commitNodeIndex}
          colour={state.isPlaceholderSkeleton
            ? hoverColour
            : getGraphColumnSelectedBackgroundColour(commitNodeIndex)
          }
        />
      )}

      {/* This column is part of a row that has been previewed (via hover) */}
      {showPreviewBackground && (
        <ColumnBackground
          id='previewed'
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
          showBottomBreakPoint={state.isBottomBreakPoint}
        />
      )}

      {/* This column is part of a merge or branching and requires a curve (left edge to top edge) */}
      {state.isLeftUpCurve && (
        <LeftUpCurve
          color={columnColour}
          showTopBreakPoint={state.isTopBreakPoint}
          isPlaceholder={state.isPlaceholderSkeleton}
        />
      )}
    </button>
  )
}