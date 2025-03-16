import { useMemo } from 'react'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'
import { useGitContext } from 'context'
import { IndexPseudoRow } from 'modules/Graph/components/IndexPseudoRow'
import { useColumnData } from 'modules/Graph/hooks/useColumnData'
import { SkeletonGraph } from 'modules/Graph/components/SkeletonGraph'
import { useResize } from 'hooks/useResize'

export const Graph = () => {
  const {
    paging,
    enableResize,
    graphData: { graphWidth, commits }
  } = useGitContext()

  const { width, ref, startResizing } = useResize()

  const { columnData, getEmptyColumnState } = useColumnData()

  const visibleCommits = useMemo(() => {
    return commits.slice(paging.startIndex, paging.endIndex)
  }, [commits, paging])

  return (
    <div className={styles.container} style={{ width }} ref={ref}>
      <div
        className={styles.graph}
        style={{
          gridTemplateColumns: `repeat(${graphWidth}, 1fr)`,
          gridTemplateRows: 'repeat(auto-fill, 40px)' // TODO: Source height from a prop once exposed
        }}
      >
        {visibleCommits.length === 0 && (
          <SkeletonGraph />
        )}

        {paging.isIndexVisible && (
          <IndexPseudoRow
            graphWidth={graphWidth}
          />
        )}

        {visibleCommits.map((commit, index) => {
          const empty = getEmptyColumnState()
          const columns = columnData.get(index + paging.startIndex + 1) ?? empty

          return (
            <GraphRow
              id={index}
              commit={commit}
              key={commit.hash}
              columns={columns}
              width={graphWidth}
            />
          )
        })}
      </div>

      {enableResize && (
        <div
          onMouseDown={startResizing}
          className={styles.dragHandle}
        />
      )}
    </div>
  )
}