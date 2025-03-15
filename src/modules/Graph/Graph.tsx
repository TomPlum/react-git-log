import { useMemo } from 'react'
import { useGitContext } from 'modules/Visualiser/context'
import { computeNodePositions, } from 'modules/Visualiser/utils/computeNodeColumns'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'
import { temporalTopologicalSort } from 'modules/Visualiser/utils/temporalTopologicalSort'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export const Graph = () => {
  const { commits: commitData } = useGitContext()

  const { width, positions, edges, commits } = useMemo(() => {
    const temporallySorted = temporalTopologicalSort(commitData)
    return computeNodePositions(temporallySorted)
  }, [commitData])

  // console.log('graph positions', positions)
  // console.log('graph width', width)
  // console.log('graph edges', edges)

  const columnData = useMemo(() => {
    const rowToColumnState = new Map<number, GraphColumnState[]>()
    const commitNodePositions = Array.from(positions.values())

    edges.search(0, commits.size).forEach(([[rowStart, colStart], [rowEnd, colEnd], type]) => {
      // Are we connecting to nodes in the same column?
      // I.e. drawing a straight merge line between them.
      if (colStart === colEnd) {
        for (let targetRow = rowStart - 1; targetRow <= rowEnd - 1; targetRow++) {
          const newColumnState: GraphColumnState[] = new Array(width).fill({
            isVerticalMergeLine: false,
            // isStartNode: currentRowNodeColumn === colStart,
            // isTerminalNode: currentRowNodeColumn === colEnd
          })

          const columnState = rowToColumnState.get(targetRow) ?? newColumnState

          columnState[colStart] = {
            ...columnState[colStart],
            isVerticalMergeLine: true,
            // isTerminalNode: currentRowNodeColumn === colEnd,
            // isStartNode: currentRowNodeColumn === targetRow
          }

          rowToColumnState.set(targetRow, columnState)
        }
      }

      commitNodePositions.forEach((position) => {
        const [row, column] = position
        const columnState = rowToColumnState.get(row) ?? new Array(width).fill({
          isVerticalMergeLine: false,
          isStartNode: false,
          isTerminalNode: false
        })

        columnState[column] = {
          ...columnState[column],
          isStartNode: true
        }
        rowToColumnState.set(row, columnState)
      })

      console.log('Row', rowStart, 'Column', colStart, '-->', 'Row', rowEnd, 'Column', colEnd, 'type', type)
    })

    return rowToColumnState
  }, [commits.size, edges, positions, width])

  return (
    <div className={styles.graph}>
      {Array.from(commits.values()).map((commit, index) => (
        <GraphRow
          id={index}
          key={commit.hash}
          width={width}
          commit={commit}
          columns={columnData.get(index + 1) ?? new Array(width).fill({
            isVerticalMergeLine: false,
            isStartNode:false,
            isTerminalNode: false
          })}
        />
      ))}
    </div>
  )
}