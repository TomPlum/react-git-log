import { useMemo } from 'react'
import { useGitContext } from 'modules/Visualiser/context'
import { computeNodePositions } from 'modules/Visualiser/utils/computeNodeColumns'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'
import { temporalTopologicalSort } from 'modules/Visualiser/utils/temporalTopologicalSort'

export const Graph = () => {
  const { commits: commitData } = useGitContext()

  const { width, positions, edges, commits } = useMemo(() => {
    const temporallySorted = temporalTopologicalSort(commitData)
    return computeNodePositions(temporallySorted)
  }, [commitData])

  console.log('graph positions', positions)
  console.log('graph width', width)
  console.log('graph edges', edges)

  edges.search(0, commits.size).forEach(([[i0, j0], [i1, j1], type]) => {
    // console.log('Edge J', node[1])
  })

  return (
    <div className={styles.graph}>
      {Array.from(positions.entries()).map(([hash, location]) => (
        <GraphRow
          key={hash}
          width={width}
          commit={commits.get(hash)!}
          commitNodeColumn={location[1]}
        />
      ))}
    </div>
  )
}