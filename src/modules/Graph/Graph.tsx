import { useMemo } from 'react'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'
import { useGitContext } from 'context'
import { IndexPseudoRow } from 'modules/Graph/components/IndexPseudoRow'
import { useColumnData } from 'modules/Graph/hooks/useColumnData'

export const Graph = () => {
  const {
    paging,
    graphData: { graphWidth, commits }
  } = useGitContext()

  const { columnData, getEmptyColumnState } = useColumnData()

  const visibleCommits = useMemo(() => {
    return commits.slice(paging.startIndex, paging.endIndex)
  }, [commits, paging])

  return (
    <div
      className={styles.graph}
      style={{
        gridTemplateColumns: `repeat(${graphWidth}, 1fr)`,
        gridTemplateRows: 'repeat(auto-fill, 40px)' // TODO: Source high from a prop once exposed
      }}
    >
      {paging.isIndexVisible && (
        <IndexPseudoRow
          graphWidth={graphWidth}
        />
      )}

      {visibleCommits.map((commit, index) => (
        <GraphRow
          id={index}
          commit={commit}
          key={commit.hash}
          width={graphWidth}
          columns={columnData.get(index + paging.startIndex + 1) ?? getEmptyColumnState()}
        />
      ))}
    </div>
  )
}