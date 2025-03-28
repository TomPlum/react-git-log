import { GraphRowProps } from './types'
import { GraphColumn } from 'modules/Graph/components/GraphColumn'

export const GraphRow = ({ id, commit, width, columns }: GraphRowProps) => {
  return (
    <>
      {new Array(width).fill(0).map((_, index) => {
        return (
          <GraphColumn
            index={index}
            rowIndex={id}
            commit={commit}
            state={columns[index]}
            commitNodeIndex={columns.findIndex(col => col.isNode)!}
            key={`row_${commit ? commit.hash : 'index'}_column_${index}}`}
          />
        )
      })}
    </>
  )
}