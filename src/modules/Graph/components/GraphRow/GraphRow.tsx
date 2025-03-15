import { GraphRowProps } from './types'
import { GraphColumn } from 'modules/Graph/components/GraphColumn'
import styles from './GraphRow.module.scss'

export const GraphRow = ({ id, commit, width, columns }: GraphRowProps) => {
  return (
    <>
      {new Array(width).fill(0).map((_, index) => {
        return (
          <GraphColumn
            index={index}
            commit={commit}
            state={columns[index]}
            key={`row_${commit.hash}_column_${index}}`}
          />
        )
      })}
    </>
  )
}