import { GraphRowProps } from './types'
import { GraphColumn } from 'modules/Graph/components/GraphColumn'
import styles from './GraphRow.module.scss'

export const GraphRow = ({ commit, commitNodeColumn, width }: GraphRowProps) => {
  return (
    <div className={styles.row} style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}>
      {new Array(width).fill(0).map((_, index) => (
        <GraphColumn
          commit={commit}
          empty={commitNodeColumn != index}
        />
      ))}
    </div>
  )
}