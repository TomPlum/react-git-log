import classNames from 'classnames'
import styles from './VerticalLine.module.scss'
import { CSSProperties, useMemo } from 'react'
import { VerticalLineProps } from './types'
import { useGitContext } from 'context/GitContext'

export const VerticalLine = ({ state, columnIndex, columnColour, commit, indexCommitNodeBorder, isIndex }: VerticalLineProps) => {
  const { headCommit } = useGitContext()
  
  const verticalNodeLineStyles = useMemo<CSSProperties>(() => {
    const isRowCommitIndexNode = commit.hash === 'index'
    const rowsCommitIsHead = commit.hash === headCommit.hash && state.isNode

    // If the current column is the index pseudo-node
    // then draw a dotted line underneath it that will
    // eventually meet with the HEAD commit of the current branch.
    if (isRowCommitIndexNode) {
      return {
        top: '50%',
        height: '50%',
        zIndex: columnIndex + 1,
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
    if (isFirstCommit || state.isColumnBelowEmpty) {
      return {
        top: 0,
        height: '50%',
        zIndex: columnIndex + 1,
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
        zIndex: columnIndex + 1,
        borderRight: `2px ${borderStyle} ${columnColour}`
      }
    }

    // If none of the above conditions are met then
    // we must be in a column with no commit node, and
    // so we draw a line the full height of the column.
    return {
      top: 0,
      height: '100%',
      zIndex: columnIndex + 1,
      borderRight: `2px ${borderStyle} ${isIndex ? indexCommitNodeBorder : columnColour}`
    }
  }, [commit.hash, commit.parents.length, commit.isBranchTip, headCommit.hash, state.isNode, state.isColumnBelowEmpty, state.isPlaceholderSkeleton, state.isColumnAboveEmpty, isIndex, columnIndex, indexCommitNodeBorder, columnColour])

  
  return (
    <div
      style={verticalNodeLineStyles}
      className={classNames(styles.line, styles.vertical)}
    />
  )
}