import { GraphRowProps } from './types'
import { GraphColumn } from 'modules/Graph/components/GraphColumn'
import { getEmptyColumnState } from 'modules/Graph/utility/getEmptyColumnState'

export const GraphRow = ({ id, commit, width, columns }: GraphRowProps) => {
  return (
    <>
      {new Array(width).fill(0).map((_, index) => {
        return (
          <GraphColumn
            index={index}
            rowIndex={id}
            commit={commit}
            commitNodeIndex={columns.findIndex(col => col.isNode)!}
            key={`row_${commit ? commit.hash : 'index'}_column_${index}}`}
            // If there is no state for the given index, then we're in a virtual column, so use an empty state
            state={columns[index] ?? getEmptyColumnState({ columns: width })}
          />
        )
      })}
    </>
  )
}