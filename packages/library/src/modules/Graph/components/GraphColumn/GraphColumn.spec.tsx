import { fireEvent, render } from '@testing-library/react'
import { GraphColumn } from './GraphColumn'
import { commit, gitContextBag } from 'test/stubs'
import * as selectCommitHandler from 'hooks/useSelectCommit'
import * as gitContext from 'context/GitContext/useGitContext'
import * as themeHook from 'hooks/useTheme'
import { graphColumn } from 'test/elements/GraphColumn'
import { ThemeFunctions } from 'hooks/useTheme'

const spyTheme = (stubs: Partial<ThemeFunctions>) => {
  return vi.spyOn(themeHook, 'useTheme').mockReturnValue({
    getGraphColumnColour: vi.fn(),
    shiftAlphaChannel: vi.fn(),
    hoverColour: 'hoverColour',
    theme: 'dark',
    textColour: 'textColour',
    reduceOpacity: vi.fn(),
    getCommitColour: vi.fn(),
    getTooltipBackground: vi.fn(),
    hoverTransitionDuration: 500,
    ...stubs
  })
}

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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a solid half-height vertical line if the rows commit is the head and this column has its node', () => {
      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        headCommit: commit({ hash: 'HEAD' }),
      }))

      render(
        <GraphColumn
          index={0}
          rowIndex={0}
          commitNodeIndex={0}
          commit={commit({ hash: 'HEAD' })} // <-- HEAD commit in this column
          state={{
            isVerticalLine: true, // <-- has a vertical line
            isNode: true // <-- this column has the node
          }}
        />
      )

      expect(graphColumn.withHeadCommitVerticalLine()).toBeInTheDocument()

      expect(graphColumn.withCommitNode({ hash: 'not-index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
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
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
    })
  })

  describe('Column Background (Selected Commit)', () => {
    it('should render a column background if the selected commits hash matches that of the columns rows, and the table is shown', () => {
      const selectedCommit = commit({ hash: 'selected-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        selectedCommit,
        showTable: true // <-- the table is shown
      }))

      const commitNodeIndex = 3
      const expectedColour = 'rgb(123, 123, 123)'
      const graphColumnColour = 'graph-column-colour'
      const getGraphColumnColour = vi.fn().mockReturnValue(graphColumnColour)
      const reduceOpacity = vi.fn().mockReturnValue(expectedColour)

      spyTheme({ getGraphColumnColour, reduceOpacity })

      render(
        <GraphColumn
          index={5}
          state={{}}
          rowIndex={0}
          commit={selectedCommit}
          commitNodeIndex={commitNodeIndex}
        />
      )

      expect(getGraphColumnColour).toHaveBeenCalledWith(commitNodeIndex)
      expect(reduceOpacity).toHaveBeenCalledWith(graphColumnColour, 0.15)

      const background = graphColumn.withSelectedBackground({ column: 5 })
      expect(background).toBeInTheDocument()
      expect(getComputedStyle(background).background).toBe(expectedColour)

      expect(graphColumn.withPreviewedBackground({ column: 5, shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a different coloured background for the selected rows column if its a placeholder', () => {
      const selectedCommit = commit({ hash: 'selected-commit' })

      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        selectedCommit
      }))

      const expectedColour = 'rgb(8, 5, 1)'
      spyTheme({
        hoverColour: expectedColour
      })

      render(
        <GraphColumn
          index={5}
          rowIndex={0}
          commitNodeIndex={0}
          commit={selectedCommit}
          state={{ isPlaceholderSkeleton: true }} // <-- is placeholder
        />
      )

      const background = graphColumn.withSelectedBackground({ column: 5 })
      expect(background).toBeInTheDocument()
      expect(getComputedStyle(background).background).toBe(expectedColour)

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

    it('should render a curved column background if the column has a commit node in it', () => {
      const previewedCommit = commit({ hash: 'previewed-commit' })
      vi.spyOn(gitContext, 'useGitContext').mockReturnValue(gitContextBag({
        previewedCommit
      }))

      const expectedBackgroundColour = 'rgb(1, 2, 3)'
      spyTheme({
        hoverColour: expectedBackgroundColour
      })

      render(
        <GraphColumn
          index={3} // <-- this column is index 3 in the row
          state={{}}
          rowIndex={0}
          commitNodeIndex={3} // <-- the commit in this row is also index 3
          commit={previewedCommit}
        />
      )

      // Should render the background
      const background = graphColumn.withPreviewedBackground({ column: 3 })
      expect(background).toBeInTheDocument()

      // Since this is the nodes column, the background should be rounded
      const backgroundStyle = getComputedStyle(background)
      expect(background).toHaveClass('backgroundBehindNode')
      expect(backgroundStyle.width).toBe('calc(50% + 24px - 4px)')
      expect(backgroundStyle.background).toBe(expectedBackgroundColour)
      expect(backgroundStyle.height).toBe('40px')
      expect(backgroundStyle.left).toBe('calc(50% - 24px + 4px)')

      expect(graphColumn.withSelectedBackground({ column: 3, shouldExist: false })).not.toBeInTheDocument()
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

  describe('Left Down Curve', () => {
    it('should render a left-down curve if the column has a left down curve element', () => {
      const getGraphColumnColour = vi.fn()
      vi.spyOn(themeHook, 'useTheme').mockReturnValue({
        getGraphColumnColour,
        shiftAlphaChannel: vi.fn(),
        hoverColour: 'hoverColour',
        theme: 'dark',
        textColour: 'textColour',
        reduceOpacity: vi.fn(),
        getCommitColour: vi.fn(),
        getTooltipBackground: vi.fn(),
        hoverTransitionDuration: 500
      })

      const graphColumnColour = 'rgb(124, 6, 168)'
      getGraphColumnColour.mockReturnValue(graphColumnColour)

      render(
        <GraphColumn
          index={1}
          rowIndex={0}
          commit={commit()}
          commitNodeIndex={2}
          state={{
            isLeftDownCurve: true, // <-- has a left-down curve
            isPlaceholderSkeleton: false // <-- but is not a placeholder
          }}
        />
      )

      expect(getGraphColumnColour).toHaveBeenCalledWith(1)

      // Should render the correct curve element
      expect(graphColumn.withLeftDownCurve()).toBeInTheDocument()

      // Since it's not a placeholder, the lines should be solid
      const leftLine = graphColumn.withLeftDownCurveLeftLine()
      const leftLineStyles = getComputedStyle(leftLine)
      expect(leftLineStyles.borderBottomStyle).toBe('solid')
      expect(leftLineStyles.borderBottomColor).toBe(graphColumnColour)

      const bottomLine = graphColumn.withLeftDownCurveBottomLine()
      const bottomLineStyles = getComputedStyle(bottomLine)
      expect(bottomLineStyles.borderRightStyle).toBe('solid')
      expect(bottomLineStyles.borderRightColor).toBe(graphColumnColour)

      const curvedLine = graphColumn.withLeftDownCurveCurvedLine()
      const curvedLinePath = curvedLine?.querySelector('path')
      expect(curvedLinePath?.getAttribute('stroke-dasharray')).toBeNull()
      expect(curvedLinePath?.getAttribute('stroke')).toBe(graphColumnColour)


      // Other elements should not be rendered
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a dotted left-down curve if the column has a left down curve element and is a placeholder', () => {
      const shiftAlphaChannel = vi.fn()
      vi.spyOn(themeHook, 'useTheme').mockReturnValue({
        getGraphColumnColour: vi.fn(),
        shiftAlphaChannel,
        hoverColour: 'hoverColour',
        theme: 'dark',
        textColour: 'textColour',
        reduceOpacity: vi.fn(),
        getCommitColour: vi.fn(),
        getTooltipBackground: vi.fn(),
        hoverTransitionDuration: 500
      })

      const placeholderColour = 'rgb(255, 255, 255)'
      shiftAlphaChannel.mockReturnValue(placeholderColour)

      render(
        <GraphColumn
          index={1}
          rowIndex={0}
          commit={commit()}
          commitNodeIndex={2}
          state={{
            isLeftDownCurve: true, // <-- has a left-down curve
            isPlaceholderSkeleton: true // <-- and is a placeholder
          }}
        />
      )

      expect(shiftAlphaChannel).toHaveBeenCalledWith('textColour', 0.8)

      // Since it's a placeholder, the lines should be dotted
      const leftLine = graphColumn.withLeftDownCurveLeftLine()
      const leftLineStyles = getComputedStyle(leftLine)
      expect(leftLineStyles.borderBottomStyle).toBe('dotted')
      expect(leftLineStyles.borderBottomColor).toBe(placeholderColour)

      const bottomLine = graphColumn.withLeftDownCurveBottomLine()
      const bottomLineStyles = getComputedStyle(bottomLine)
      expect(bottomLineStyles.borderRightStyle).toBe('dotted')
      expect(bottomLineStyles.borderRightColor).toBe(placeholderColour)

      const curvedLine = graphColumn.withLeftDownCurveCurvedLine()
      const curvedLinePath = curvedLine?.querySelector('path')
      expect(curvedLinePath?.getAttribute('stroke-dasharray')).toBe('2 2')
      expect(curvedLinePath?.getAttribute('stroke')).toBe(placeholderColour)

      // Other elements should not be rendered
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftUpCurve({ shouldExist: false })).not.toBeInTheDocument()
    })
  })

  describe('Left Up Curve', () => {
    it('should render a left-up curve if the column has a left up curve element', () => {
      const getGraphColumnColour = vi.fn()
      vi.spyOn(themeHook, 'useTheme').mockReturnValue({
        getGraphColumnColour,
        shiftAlphaChannel: vi.fn(),
        hoverColour: 'hoverColour',
        theme: 'dark',
        textColour: 'textColour',
        reduceOpacity: vi.fn(),
        getCommitColour: vi.fn(),
        getTooltipBackground: vi.fn(),
        hoverTransitionDuration: 500
      })

      const graphColumnColour = 'rgb(124, 6, 168)'
      getGraphColumnColour.mockReturnValue(graphColumnColour)

      render(
        <GraphColumn
          index={1}
          rowIndex={0}
          commit={commit()}
          commitNodeIndex={2}
          state={{
            isLeftUpCurve: true, // <-- has a left-up curve
            isPlaceholderSkeleton: false // <-- but is not a placeholder
          }}
        />
      )

      expect(getGraphColumnColour).toHaveBeenCalledWith(1)

      // Should render the correct curve element
      expect(graphColumn.withLeftUpCurve()).toBeInTheDocument()

      // Since it's not a placeholder, the lines should be solid
      const leftLine = graphColumn.withLeftUpCurveLeftLine()
      const leftLineStyles = getComputedStyle(leftLine)
      expect(leftLineStyles.borderBottomStyle).toBe('solid')
      expect(leftLineStyles.borderBottomColor).toBe(graphColumnColour)

      const topLine = graphColumn.withLeftUpCurveTopLine()
      const topLineStyles = getComputedStyle(topLine)
      expect(topLineStyles.borderRightStyle).toBe('solid')
      expect(topLineStyles.borderRightColor).toBe(graphColumnColour)

      const curvedLine = graphColumn.withLeftUpCurveCurvedLine()
      const curvedLinePath = curvedLine?.querySelector('path')
      expect(curvedLinePath?.getAttribute('stroke-dasharray')).toBeNull()
      expect(curvedLinePath?.getAttribute('stroke')).toBe(graphColumnColour)


      // Other elements should not be rendered
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a dotted left-up curve if the column has a left up curve element and is a placeholder', () => {
      const shiftAlphaChannel = vi.fn()
      vi.spyOn(themeHook, 'useTheme').mockReturnValue({
        getGraphColumnColour: vi.fn(),
        shiftAlphaChannel,
        hoverColour: 'hoverColour',
        theme: 'dark',
        textColour: 'textColour',
        reduceOpacity: vi.fn(),
        getCommitColour: vi.fn(),
        getTooltipBackground: vi.fn(),
        hoverTransitionDuration: 500
      })

      const placeholderColour = 'rgb(255, 255, 255)'
      shiftAlphaChannel.mockReturnValue(placeholderColour)

      render(
        <GraphColumn
          index={1}
          rowIndex={0}
          commit={commit()}
          commitNodeIndex={2}
          state={{
            isLeftUpCurve: true, // <-- has a left-up curve
            isPlaceholderSkeleton: true // <-- and is a placeholder
          }}
        />
      )

      expect(shiftAlphaChannel).toHaveBeenCalledWith('textColour', 0.8)

      // Since it's a placeholder, the lines should be dotted
      const leftLine = graphColumn.withLeftUpCurveLeftLine()
      const leftLineStyles = getComputedStyle(leftLine)
      expect(leftLineStyles.borderBottomStyle).toBe('dotted')
      expect(leftLineStyles.borderBottomColor).toBe(placeholderColour)

      const topLine = graphColumn.withLeftUpCurveTopLine()
      const topLineStyles = getComputedStyle(topLine)
      expect(topLineStyles.borderRightStyle).toBe('dotted')
      expect(topLineStyles.borderRightColor).toBe(placeholderColour)

      const curvedLine = graphColumn.withLeftUpCurveCurvedLine()
      const curvedLinePath = curvedLine?.querySelector('path')
      expect(curvedLinePath?.getAttribute('stroke-dasharray')).toBe('2 2')
      expect(curvedLinePath?.getAttribute('stroke')).toBe(placeholderColour)

      // Other elements should not be rendered
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullWidthHorizontalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withHeadCommitVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withFullHeightVerticalLine({ shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withSelectedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withPreviewedBackground({ column: 0, shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withLeftDownCurve({ shouldExist: false })).not.toBeInTheDocument()
    })
  })
})