import { GraphRowProps } from './types'
import { GraphColumn } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { getEmptyColumnState } from 'modules/Graph/strategies/Grid/utility/getEmptyColumnState'
import { useGraphContext } from 'modules/Graph/context'

export const GraphRow = ({ id, commit, columns }: GraphRowProps) => {
  const { graphWidth, orientation } = useGraphContext()

  return (
    <>
      {new Array(graphWidth).fill(0).map((_, index) => {
        const normalisedIndex = orientation === 'normal'
        ? index
        : graphWidth - 1 - index

        return (
          <GraphColumn
            rowIndex={id}
            commit={commit}
            index={normalisedIndex}
            commitNodeIndex={columns.findIndex(col => col.isNode)!}
            key={`row_${commit ? commit.hash : 'index'}_column_${normalisedIndex}}`}
            // If there is no state for the given index, then we're in a virtual column, so use an empty state
            state={columns[normalisedIndex] ?? getEmptyColumnState({ columns: graphWidth })}
          />
        )
      })}
    </>
  )
}