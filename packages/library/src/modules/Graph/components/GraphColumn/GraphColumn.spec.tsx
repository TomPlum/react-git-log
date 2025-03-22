import { fireEvent, render } from '@testing-library/react'
import { GraphColumn } from './GraphColumn'
import { commit, gitContextBag } from 'test/stubs'
import * as selectCommitHandler from 'hooks/useSelectCommit'
import * as gitContext from 'context/GitContext/useGitContext'
import { graphColumn } from 'test/elements/GraphColumn'

describe('GraphColumn', () => {
  describe('Event Handling', () => {
    it('should invoke the correct select commit handler events when interacting with the column container', () => {
      const onMouseOutHandler = vi.fn()
      const onMouseOverHandler = vi.fn()
      const onClickHandler = vi.fn()

      vi.spyOn(selectCommitHandler, 'useSelectCommit').mockReturnValue({
        selectCommitHandler: {
          onMouseOut: onMouseOutHandler,
          onMouseOver: onMouseOverHandler,
          onClick: onClickHandler
        }
      })

      const columnsRowCommit = commit()

      render(
        <GraphColumn
          index={0}
          state={{}}
          rowIndex={0}
          commitNodeIndex={0}
          commit={columnsRowCommit}
        />
      )

      const columnElement = graphColumn.at({ row: 0, column: 0 })

      fireEvent.mouseOver(columnElement)
      expect(onMouseOverHandler).toHaveBeenCalledOnce()
      expect(onMouseOutHandler).not.toHaveBeenCalled()
      expect(onClickHandler).not.toHaveBeenCalled()

      fireEvent.mouseOut(columnElement)
      expect(onMouseOverHandler).toHaveBeenCalledOnce()
      expect(onMouseOutHandler).toHaveBeenCalledOnce()
      expect(onClickHandler).not.toHaveBeenCalled()

      fireEvent.click(columnElement)
      expect(onMouseOverHandler).toHaveBeenCalledOnce()
      expect(onMouseOutHandler).toHaveBeenCalledOnce()
      expect(onClickHandler).toHaveBeenCalledExactlyOnceWith(columnsRowCommit)
    })
  })

  describe('Commit Nodes', () => {
    it('should render a commit node if the column state has a node, but is not the index node', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commitNodeIndex={0}
          state={{ isNode: true }} // <-- is a commit node
          commit={commit({ hash: 'not-index' })} // <-- and is not the index
        />
      )

      expect(graphColumn.withCommitNode({ hash: 'not-index' })).toBeInTheDocument()

      // Other column elements should not be rendered
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a pseudo commit node if the column state has a node and is the index node', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commitNodeIndex={0}
          state={{ isNode: true }} // <-- is a commit node
          commit={commit({ hash: 'index' })} // <-- but is the index
        />
      )

      expect(graphColumn.withIndexPseudoCommitNode()).toBeInTheDocument()

      // Other column elements should not be rendered
      expect(graphColumn.withCommitNode({ hash: 'index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should not render a commit node if the column state is the index node but does not contain a commit node', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commitNodeIndex={0}
          state={{ isNode: false }} // <-- is not a commit node
          commit={commit({ hash: 'index' })} // <-- and is the index
        />
      )

      expect(graphColumn.withCommitNode({ hash: 'index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should not render a commit node if the column state has no commit or index node', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commitNodeIndex={0}
          state={{ isNode: false }} // <-- is not a commit node
          commit={commit({ hash: 'not-index' })} // <-- nor the index
        />
      )

      expect(graphColumn.withCommitNode({ hash: 'not-index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })
  })

  describe('Vertical Lines', () => {
    it('should render a full height solid vertical line if the state has a vertical line but not an index line', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commit={commit()}
          commitNodeIndex={0}
          state={{
            isVerticalLine: true, // <-- is a vertical line
            isVerticalIndexLine: false // <-- but is not drawn from the index node
          }}
        />
      )

      const verticalLine = graphColumn.withFullHeightVerticalLine()
      expect(verticalLine).toBeInTheDocument()
      expect(getComputedStyle(verticalLine).borderRightStyle).toBe('solid')

      expect(graphColumn.withCommitNode({ hash: 'not-index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a full height dotted vertical line if the state has a vertical line and index line', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commit={commit()}
          commitNodeIndex={0}
          state={{
            isVerticalLine: true, // <-- is a vertical line
            isVerticalIndexLine: true // <-- and is drawn from the index node
          }}
        />
      )

      const verticalLine = graphColumn.withFullHeightVerticalLine()
      expect(verticalLine).toBeInTheDocument()
      expect(getComputedStyle(verticalLine).borderRightStyle).toBe('dotted')

      expect(graphColumn.withCommitNode({ hash: 'not-index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })
  })

  describe('Horizontal Lines', () => {
    it('should render a full width solid horizontal line if the state has a horizontal line', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commit={commit()}
          commitNodeIndex={0}
          state={{ isHorizontalLine: true }} // <-- is a horizontal line
        />
      )

      const horizontalLine = graphColumn.withFullWidthHorizontalLine()
      expect(horizontalLine).toBeInTheDocument()
      expect(getComputedStyle(horizontalLine).borderTopStyle).toBe('solid')

      expect(graphColumn.withCommitNode({ hash: 'not-index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHalfWidthRightHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a right half solid horizontal line if the column has a commit and is the target of a merge', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commitNodeIndex={0}
          commit={commit({ hash: 'merge-target-node' })}
          state={{
            isHorizontalLine: true, // <-- has is a horizontal line
            isNode: true, // <-- also contains a commit node
            mergeSourceColumns: [1], // <-- and has been merged into
            isPlaceholderSkeleton: false // <-- not a placeholder, so solid line
          }}
        />
      )


      // Should render the half-width line on the right side
      const horizontalLine = graphColumn.withHalfWidthRightHorizontalLine()
      expect(horizontalLine).toBeInTheDocument()
      expect(getComputedStyle(horizontalLine).borderTopStyle).toBe('solid')

      // Plus the commit node
      expect(graphColumn.withCommitNode({ hash: 'merge-target-node' })).toBeInTheDocument()

      // Other elements should not be rendered
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a right half dotted horizontal line if the column has a commit, is the target of a merge and is a placeholder', () => {
      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commitNodeIndex={0}
          commit={commit({ hash: 'merge-target-node-2' })}
          state={{
            isHorizontalLine: true, // <-- has is a horizontal line
            isNode: true, // <-- also contains a commit node
            mergeSourceColumns: [1], // <-- and has been merged into
            isPlaceholderSkeleton: true // <-- is a placeholder, so dotted line
          }}
        />
      )


      // Should render the half-width line on the right side
      const horizontalLine = graphColumn.withHalfWidthRightHorizontalLine()
      expect(horizontalLine).toBeInTheDocument()
      expect(getComputedStyle(horizontalLine).borderTopStyle).toBe('dotted')

      // Plus the commit node
      expect(graphColumn.withCommitNode({ hash: 'merge-target-node-2' })).toBeInTheDocument()

      // Other elements should not be rendered
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
    })
  })

  describe('Column Background (Selected Commit)', () => {
    it('should render a column background if the selected commits hash matches that of the columns rows, and the table is shown', () => {
      const selectedCommit = commit({ hash: 'selected-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        selectedCommit,
        showTable: true // <-- the table is shown
      }))

      render(
        <GraphColumn
          index={5}
          state={{}}
          rowIndex={0}
          commitNodeIndex={0}
          commit={selectedCommit}
        />
      )

      expect(graphColumn.withSelectedBackground({ column: 5 })).toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 5, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should not render a column background if the the table is shown but the selected commits hash does not match', () => {
      const selectedCommit = commit({ hash: 'selected-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        selectedCommit,
        showTable: true // <-- the table is shown
      }))

      render(
        <GraphColumn
          index={2}
          state={{}}
          rowIndex={0}
          commitNodeIndex={0}
          commit={commit({
            hash: 'different-hash' // <-- The commit in this columns row does not match the selected
          })}
        />
      )

      expect(graphColumn.withSelectedBackground({ column: 2, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 2, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a column background when the table is not shown if the commit on this row is in this column', () => {
      const selectedCommit = commit({ hash: 'selected-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        selectedCommit,
        showTable: false // <-- the table is not shown
      }))

      render(
        <GraphColumn
          index={7} // <-- This column is index 7 in the row
          state={{}}
          rowIndex={0}
          commitNodeIndex={7} // <-- the commit on this row is also in this column
          commit={selectedCommit} // <-- The selected commit is on this columns row
        />
      )

      expect(graphColumn.withSelectedBackground({ column: 7 })).toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 7, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should not render a column background if the the table is not shown and the commit on this row is in a different column', () => {
      const selectedCommit = commit({ hash: 'selected-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        selectedCommit,
        showTable: false // <-- the table is not shown
      }))

      render(
        <GraphColumn
          index={7} // <-- This column is index 7 in the row
          state={{}}
          rowIndex={0}
          commitNodeIndex={2} // <-- the commit on this row is in a different column
          commit={selectedCommit} // <-- The selected commit is on this columns row
        />
      )

      expect(graphColumn.withSelectedBackground({ column: 7, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 7, shouldExist: false })).not.toBeInTheDocument()
    })
  })

  describe('Column Background (Previewed Commit)', () => {
    it('should render a column background if the previewed commits hash matches that of the columns rows, and the table is shown', () => {
      const previewedCommit = commit({ hash: 'previewed-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        previewedCommit,
        showTable: true // <-- the table is shown
      }))

      render(
        <GraphColumn
          index={5}
          state={{}}
          rowIndex={0}
          commitNodeIndex={0}
          commit={previewedCommit}
        />
      )

      expect(graphColumn.withPreviewedBackground({ column: 5 })).toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 5, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should not render a previewed column background if the previewed commits hash matches that of the columns rows, the table is shown, but the row is already selected', () => {
      // This row is already selected, but the user is hovering too, so it's marked as previewed
      const commitHash = 'the-commit-of-this-row'
      const previewedCommit = commit({ hash: commitHash })
      const selectedCommit = commit({ hash: commitHash })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        previewedCommit,
        selectedCommit,
        showTable: true // <-- the table is shown
      }))

      render(
        <GraphColumn
          index={5}
          state={{}}
          rowIndex={0}
          commitNodeIndex={0}
          commit={commit({ hash: commitHash })}
        />
      )

      expect(graphColumn.withSelectedBackground({ column: 5 })).toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 5, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should not render a column background if the the table is shown but the previewed commits hash does not match', () => {
      const previewedCommit = commit({ hash: 'previewed-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        previewedCommit,
        showTable: true // <-- the table is shown
      }))

      render(
        <GraphColumn
          index={2}
          state={{}}
          rowIndex={0}
          commitNodeIndex={0}
          commit={commit({
            hash: 'different-hash' // <-- The commit in this columns row does not match the previewed
          })}
        />
      )

      expect(graphColumn.withPreviewedBackground({ column: 2, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 2, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a column background when the table is not shown if the commit on this row is in this column', () => {
      const previewedCommit = commit({ hash: 'previewed-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        previewedCommit,
        showTable: false // <-- the table is not shown
      }))

      render(
        <GraphColumn
          index={7} // <-- This column is index 7 in the row
          state={{}}
          rowIndex={0}
          commitNodeIndex={7} // <-- the commit on this row is also in this column
          commit={previewedCommit} // <-- The previewed commit is on this columns row
        />
      )

      expect(graphColumn.withPreviewedBackground({ column: 7 })).toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 7, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should not render a column background if the the table is not shown and the commit on this row is in a different column', () => {
      const previewedCommit = commit({ hash: 'previewed-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        previewedCommit,
        showTable: false // <-- the table is not shown
      }))

      render(
        <GraphColumn
          index={7} // <-- This column is index 7 in the row
          state={{}}
          rowIndex={0}
          commitNodeIndex={2} // <-- the commit on this row is in a different column
          commit={previewedCommit} // <-- The previewedCommit commit is on this columns row
        />
      )

      expect(graphColumn.withPreviewedBackground({ column: 7, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 7, shouldExist: false })).not.toBeInTheDocument()
    })
  })
})