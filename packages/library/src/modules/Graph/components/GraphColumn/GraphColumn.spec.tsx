import { fireEvent, render } from '@testing-library/react'
import { GraphColumn } from './GraphColumn'
import { commit } from 'test/stubs'
import * as selectCommitHandler from 'hooks/useSelectCommit'
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
    })
  })

  describe('Vertical Lines', () => {
    it('should render a full height solid vertical line if the state isVerticalLine but not isVerticalIndexLine', () => {
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

      expect(graphColumn.withFullHeightVerticalLine()).toBeInTheDocument()
      expect(getComputedStyle(graphColumn.withFullHeightVerticalLine()).borderRightStyle).toBe('solid')

      expect(graphColumn.withCommitNode({ hash: 'not-index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
    })

    it('should render a full height vertical line if the state has isVerticalLine', () => {
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

      expect(graphColumn.withFullHeightVerticalLine()).toBeInTheDocument()
      expect(getComputedStyle(graphColumn.withFullHeightVerticalLine()).borderRightStyle).toBe('dotted')

      expect(graphColumn.withCommitNode({ hash: 'not-index', shouldExist: false })).not.toBeInTheDocument()
      expect(graphColumn.withIndexPseudoCommitNode({ shouldExist: false })).not.toBeInTheDocument()
    })
  })
})