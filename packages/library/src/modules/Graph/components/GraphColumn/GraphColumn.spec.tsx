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

    render(
      <GraphColumn
        index={0}
        state={{}}
        rowIndex={0}
        commit={commit()}
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
    expect(onClickHandler).toHaveBeenCalledOnce()
  })
})