import { render } from '@testing-library/react'
import { GraphRow } from './GraphRow'
import { commit, graphColumnState, graphContextBag, themeFunctions } from 'test/stubs'
import { graphColumn } from 'test/elements/GraphColumn'
import * as themeHook from 'hooks/useTheme'
import * as graphContext from 'modules/Graph/context'

describe('GraphRow', () => {
  it('should render a column for each one in the columns property', () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValueOnce(graphContextBag({
      graphWidth: 3
    }))

    render(
      <GraphRow
        id={0}
        commit={commit()}
        columns={[
          graphColumnState(),
          graphColumnState(),
          graphColumnState()
        ]}
      />
    )

    expect(graphColumn.at({ row: 0, column: 0 })).toBeInTheDocument()
    expect(graphColumn.at({ row: 0, column: 1 })).toBeInTheDocument()
    expect(graphColumn.at({ row: 0, column: 2 })).toBeInTheDocument()
  })

  it('should pass the column index that the node for this row is in to the columns', () => {
    vi.spyOn(graphContext, 'useGraphContext').mockReturnValueOnce(graphContextBag({
      graphWidth: 3
    }))
    
    const graphColumnColour = 'rgb(56, 56, 56)'
    const getGraphColumnColour = vi.fn().mockImplementation(index => {
      // Commit node is at index 2, so return a unique colour here
      if (index === 2) {
        return graphColumnColour
      }

      return 'rgb(0, 0, 0)'
    })

    vi.spyOn(themeHook, 'useTheme').mockReturnValue(themeFunctions({
      getGraphColumnColour
    }))

    render(
      <GraphRow
        id={0}
        commit={commit()}
        columns={[
          graphColumnState(),
          graphColumnState({
            isHorizontalLine: true, // <-- we have a horizontal line in column index 1
            isPlaceholderSkeleton: false,
            mergeSourceColumns: undefined
          }),
          graphColumnState({
            isNode: true // <-- the node is in column index 2
          })
        ]}
      />
    )

    // Proving that the correct commit node index is passed
    // into the column. It drives a few things, but the horizontal
    // line is coloured based on the index of the column with the commit node.
    expect(getGraphColumnColour).toHaveBeenCalledWith(1)
    const horizontalLine = graphColumn.withFullWidthHorizontalLine()
    expect(horizontalLine).toBeInTheDocument()
    expect(getComputedStyle(horizontalLine).borderTopColor).toBe(graphColumnColour)
  })
})