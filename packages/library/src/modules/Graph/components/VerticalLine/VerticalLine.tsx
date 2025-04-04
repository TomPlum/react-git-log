import classNames from 'classnames'
import styles from './VerticalLine.module.scss'
import { CSSProperties, useMemo } from 'react'
import { VerticalLineProps } from './types'
import { useGitContext } from 'context/GitContext'

export const VerticalLine = ({ state, columnIndex, columnColour, commit, indexCommitNodeBorder, isIndex }: VerticalLineProps) => {
  const { headCommit, isServerSidePaginated, headCommitHash, isIndexVisible } = useGitContext()

  const border = useMemo<CSSProperties>(() => {
    // Border is dotted for the index pseudo-node
    // and the skeleton placeholder elements.
    const borderStyle = (isIndex) || state.isPlaceholderSkeleton ? 'dotted' : 'solid'

    const borderColour = isIndex ? indexCommitNodeBorder : columnColour

    // If we're on the first or last row of a page of data,
    // use the border-image trick to render a linear-gradient
    // of the border colour so it fades out.
    if ((state.isLastRow || state.isFirstRow) && !state.isVerticalIndexLine) {
      const direction = state.isLastRow ? 'bottom' : 'top'
      return {
        borderRight: '2px solid transparent',
        borderImage: `linear-gradient(to ${direction}, ${borderColour}, transparent) 1`
      }
    }

    // Otherwise it's just a normal border
    return {
      borderRight: `2px ${borderStyle} ${borderColour}`
    }
  }, [columnColour, indexCommitNodeBorder, isIndex, state.isFirstRow, state.isLastRow, state.isPlaceholderSkeleton, state.isVerticalIndexLine])
  
  const { style, variant } = useMemo<{ style: CSSProperties, variant: string }>(() => {
    const isRowCommitIndexNode = commit.hash === 'index'
    const rowsCommitIsHead = commit.hash === headCommit?.hash && state.isNode

    // If the current column is the index pseudo-node
    // then draw a dotted line underneath it that will
    // eventually meet with the HEAD commit of the current branch.
    if (isRowCommitIndexNode) {
      return {
        variant: 'bottom-half-dotted',
        style: {
          top: '50%',
          height: '50%',
          zIndex: columnIndex + 1,
          borderRight: `2px dotted ${indexCommitNodeBorder}`
        }
      }
    }

    // If this column has the HEAD commit node in it,
    // just draw a dotted line on top of it which will
    // ultimately hit the index pseudo-node above.
    if (rowsCommitIsHead && isIndexVisible) {
      return {
        variant: 'top-half-dotted',
        style: {
          height: '50%',
          top: 0,
          borderRight: `2px dotted ${indexCommitNodeBorder}`
        }
      }
    }

    // If this column has a commit node in it, and it
    // has no parents, then it must be the first commit
    // in the graph, so just draw a solid line above it.
    const isFirstCommit = state.isNode && commit.parents.length === 0
    if (isFirstCommit || state.isColumnBelowEmpty) {
      return {
        variant: 'top-half',
        style: {
          top: 0,
          height: '50%',
          zIndex: columnIndex + 1,
          ...border
        }
      }
    }

    // If this column contains a commit node, and
    // it is the tip of its branch, then just draw
    // a line underneath the node. Same goes for a
    // column that an empty one in the row above.
    const isBranchTip = isServerSidePaginated
      ? commit.hash === headCommitHash
      : commit.isBranchTip && state.isNode

    if (isBranchTip || state.isColumnAboveEmpty) {
      return {
        variant: 'bottom-half',
        style: {
          top: '50%',
          height: '50%',
          zIndex: columnIndex + 1,
          ...border
        }
      }
    }

    // If none of the above conditions are met then
    // we must be in a column with no commit node, and
    // so we draw a line the full height of the column.
    return {
      variant: 'full-height',
      style: {
        top: 0,
        height: '100%',
        zIndex: columnIndex + 1,
        ...border
      }
    }
  }, [commit.hash, commit.parents.length, commit.isBranchTip, headCommit?.hash, state.isNode, state.isColumnBelowEmpty, state.isColumnAboveEmpty, isServerSidePaginated, headCommitHash, columnIndex, border, indexCommitNodeBorder])

  
  return (
    <div
      style={style}
      id={`vertical-line-${variant}`}
      data-testid={`vertical-line-${variant}`}
      className={classNames(styles.line, styles.vertical)}
    />
  )
}