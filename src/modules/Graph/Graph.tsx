import { useMemo } from 'react'
import { useGitContext } from 'modules/Visualiser/context'
import { computeNodePositions } from 'modules/Visualiser/utils/computeNodeColumns'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'

export const Graph = () => {
  const { commits: commitData } = useGitContext()

  const { width, positions, edges, commits } = useMemo(() => {
    return computeNodePositions(commitData)
  }, [commitData])

  console.log('graph positions', positions)
  console.log('graph positions (entries)', Object.entries(positions))
  console.log('graph width', width)

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