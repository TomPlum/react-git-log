import { fireEvent, render, screen } from '@testing-library/react'
import { GraphColumn } from './GraphColumn'
import { commit } from 'test/stubs'
import * as selectCommitHandler from 'hooks/useSelectCommit'

describe('GraphColumn', () => {
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
        commit={columnsRowCommit}
        commitNodeIndex={0}
      />
    )

    const columnElement = screen.getByTestId('graph-column-row-0-col-0')

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

  it('should render a node commit if the column state has a node, but is not the index node', () => {
    render(
      <GraphColumn
        index={0}
        rowIndex={0}
        commitNodeIndex={0}
        state={{ isNode: true }} // <-- is a commit node
        commit={commit({ hash: 'not-index' })} // <-- and is not the index
      />
    )

    expect(screen.getByTestId('commit-node-not-index')).toBeInTheDocument()
  })

  it('should not render a node commit if the column state has a node, is the index node', () => {
    render(
      <GraphColumn
        index={0}
        rowIndex={0}
        commitNodeIndex={0}
        state={{ isNode: true }} // <-- is a commit node
        commit={commit({ hash: 'index' })} // <-- but is the index
      />
    )

    expect(screen.queryByTestId('commit-node-index')).not.toBeInTheDocument()
  })

  it('should not render a node commit if the column state is the index node but does not contain a commit node', () => {
    render(
      <GraphColumn
        index={0}
        rowIndex={0}
        commitNodeIndex={0}
        state={{ isNode: false }} // <-- is not a commit node
        commit={commit({ hash: 'index' })} // <-- and is the index
      />
    )

    expect(screen.queryByTestId('commit-node-index')).not.toBeInTheDocument()
  })

  it('should not render a node commit if the column state has no commit or index node', () => {
    render(
      <GraphColumn
        index={0}
        rowIndex={0}
        commitNodeIndex={0}
        state={{ isNode: false }} // <-- is not a commit node
        commit={commit({ hash: 'not-index' })} // <-- nor the index
      />
    )

    expect(screen.queryByTestId('commit-node-not-index')).not.toBeInTheDocument()
  })
})