import { useMemo } from 'react'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'
import { useGitContext } from 'context/GitContext'
import { IndexPseudoRow } from 'modules/Graph/components/IndexPseudoRow'
import { useColumnData } from 'modules/Graph/hooks/useColumnData'
import { SkeletonGraph } from 'modules/Graph/components/SkeletonGraph'
import { useResize } from 'hooks/useResize'
import { ROW_HEIGHT } from 'constants/constants'
import { placeholderCommits } from 'modules/Graph/hooks/usePlaceholderData/data'
import { GraphProps } from './types'
import { GraphContext, GraphContextBag } from './context'

/**
 * To print columnData for graph column state
 * for integration tests use
 * console.log(JSON.stringify(Object.fromEntries(columnData), null, 2))
 */
export const Graph = ({
  nodeTheme = 'default',
  enableResize = false,
  showCommitNodeHashes = false,
  showCommitNodeTooltips = false
}: GraphProps) => {
  const {
    paging,
    rowSpacing,
    graphData: { graphWidth, commits }
  } = useGitContext()

  const { width, ref, startResizing } = useResize()
  const { columnData, getEmptyColumnState } = useColumnData()

  const visibleCommits = useMemo(() => {
    return commits.slice(paging.startIndex, paging.endIndex)
  }, [commits, paging])

  const commitQuantity = useMemo(() => {
    // If there is no data being shown, then we'll
    // be rendering the skeleton graph placeholder which
    // shows fake commits.
    if (visibleCommits.length === 0) {
      return placeholderCommits.length
    }

    // If the index node is visible then we show one
    // extra commit in the form of the index pseudo-node.
    if (paging.isIndexVisible) {
      return visibleCommits.length + 1
    }

    // Else, just the number of visible commits, relative
    // to the current pagination configuration.
    return visibleCommits.length
  }, [paging.isIndexVisible, visibleCommits.length])

  const contextValue = useMemo<GraphContextBag>(() => ({
    showCommitNodeTooltips,
    showCommitNodeHashes,
    nodeTheme
  }), [showCommitNodeHashes, showCommitNodeTooltips, nodeTheme])

  return (
    <GraphContext value={contextValue}>
      <div className={styles.container} style={{ width }} ref={ref}>
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
                id={index + 1}
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
    </GraphContext>
  )
}