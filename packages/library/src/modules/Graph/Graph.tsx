import { useEffect, useMemo } from 'react'
import { GraphRow } from 'modules/Graph/components/GraphRow'
import styles from './Graph.module.scss'
import { useGitContext } from 'context/GitContext'
import { IndexPseudoRow } from 'modules/Graph/components/IndexPseudoRow'
import { useColumnData } from 'modules/Graph/hooks/useColumnData'
import { SkeletonGraph } from 'modules/Graph/components/SkeletonGraph'
import { useResize } from 'hooks/useResize'
import { DEFAULT_NODE_SIZE, ROW_HEIGHT } from 'constants/constants'
import { placeholderCommits } from 'modules/Graph/hooks/usePlaceholderData/data'
import { GraphProps } from './types'
import { GraphContext, GraphContextBag } from './context'

export const Graph = ({
  nodeSize = DEFAULT_NODE_SIZE,
  nodeTheme = 'default',
  enableResize = false,
  showCommitNodeHashes = false,
  showCommitNodeTooltips = false
}: GraphProps) => {
  const {
    paging,
    rowSpacing,
    setNodeSize,
    isIndexVisible,
    graphData: { graphWidth, commits }
  } = useGitContext()

  useEffect(() => {
    setNodeSize(nodeSize)
  }, [nodeSize, setNodeSize])

  const { width, ref, startResizing } = useResize()

  const visibleCommits = useMemo(() => {
    if (paging) {
      return commits.slice(paging.startIndex, paging.endIndex)
    }

    return commits
  }, [commits, paging])

  const { columnData, getEmptyColumnState, virtualColumns } = useColumnData({
    visibleCommits: visibleCommits.length
  })

  const virtualisedGraphWidth = graphWidth + virtualColumns

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

  const contextValue = useMemo<GraphContextBag>(() => ({
    showCommitNodeTooltips,
    showCommitNodeHashes,
    nodeTheme,
    nodeSize
  }), [showCommitNodeHashes, showCommitNodeTooltips, nodeTheme, nodeSize])

  return (
    <GraphContext value={contextValue}>
      <div className={styles.container} style={{ width }} ref={ref}>
        <div
          className={styles.graph}
          style={{
            gridTemplateColumns: `repeat(${virtualisedGraphWidth}, 1fr)`,
            gridTemplateRows: `repeat(${commitQuantity}, ${ROW_HEIGHT + rowSpacing}px)`
          }}
        >
          {visibleCommits.length === 0 && (
            <SkeletonGraph />
          )}

          {isIndexVisible && (
            <IndexPseudoRow
              graphWidth={virtualisedGraphWidth}
            />
          )}

          {visibleCommits.map((commit, index) => {
            const empty = getEmptyColumnState()
            const rowIndex = paging ? index + paging?.startIndex + 1 : index
            const columns = columnData.get(rowIndex) ?? empty

            return (
              <GraphRow
                id={index + 1}
                commit={commit}
                key={commit.hash}
                columns={columns}
                width={virtualisedGraphWidth}
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