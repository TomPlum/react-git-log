import styles from 'modules/Graph/Graph.module.scss'
import { ROW_HEIGHT } from 'constants/constants'
import { SkeletonGraph } from 'modules/Graph/strategies/Grid/components/SkeletonGraph'
import { IndexPseudoRow } from 'modules/Graph/strategies/Grid/components/IndexPseudoRow'
import { GraphRow } from 'modules/Graph/strategies/Grid/components/GraphRow'
import { useGraphContext } from 'modules/Graph/context'
import { useGitContext } from 'context/GitContext'
import { getEmptyColumnState } from 'modules/Graph/strategies/Grid/utility/getEmptyColumnState'
import { useMemo } from 'react'
import { placeholderCommits } from 'modules/Graph/strategies/Grid/hooks/usePlaceholderData/data'

export const HTMLGridGraph = () => {
  const { isIndexVisible, rowSpacing, paging } = useGitContext()
  const { graphWidth, visibleCommits, columnData } = useGraphContext()

  const commitQuantity = useMemo(() => {
    // If there is no data being shown, then we'll
    // be rendering the skeleton graph placeholder which
    // shows fake commits.
    if (visibleCommits.length === 0) {
      return placeholderCommits.length
    }

    // If the index node is visible then we show one
    // extra commit in the form of the index pseudo-node.
    if (isIndexVisible) {
      return visibleCommits.length + 1
    }

    // Else, just the number of visible commits, relative
    // to the current pagination configuration.
    return visibleCommits.length
  }, [isIndexVisible, visibleCommits.length])

  return (
    <div
      className={styles.graph}
      style={{
        gridTemplateColumns: `repeat(${graphWidth}, 1fr)`,
        gridTemplateRows: `repeat(${commitQuantity}, ${ROW_HEIGHT + rowSpacing}px)`
      }}
    >
      {visibleCommits.length === 0 && (
        <SkeletonGraph />
      )}

      {isIndexVisible && (
        <IndexPseudoRow />
      )}

      {visibleCommits.map((commit, index) => {
        const empty = getEmptyColumnState({ columns: graphWidth })
        const rowIndex = paging ? index + paging?.startIndex + 1 : index
        const columns = columnData.get(rowIndex) ?? empty

        return (
          <GraphRow
            id={index + 1}
            commit={commit}
            key={commit.hash}
            columns={columns}
          />
        )
      })}
    </div>
  )
}