import { PropsWithChildren, useEffect, useMemo } from 'react'
import styles from './GraphCore.module.scss'
import { useGitContext } from 'context/GitContext'
import { useColumnData } from 'modules/Graph/strategies/Grid/hooks/useColumnData'
import { useResize } from 'hooks/useResize'
import { DEFAULT_NODE_SIZE } from 'constants/constants'
import { GraphContext, GraphContextBag } from '../context'
import { GraphCoreProps } from 'modules/Graph/core/types'

export const GraphCore = ({
  children,
  nodeSize = DEFAULT_NODE_SIZE,
  nodeTheme = 'default',
  orientation = 'normal',
  enableResize = false,
  showCommitNodeHashes = false,
  showCommitNodeTooltips = false
}: PropsWithChildren<GraphCoreProps>) => {
  const {
    paging,
    setNodeSize,
    setGraphOrientation,
    graphData: { graphWidth, commits }
  } = useGitContext()

  useEffect(() => {
    // Informs the wrapping GitContext about the
    // change in certain props so other components can respond.
    setNodeSize(nodeSize)
    setGraphOrientation(orientation)
  }, [nodeSize, orientation, setGraphOrientation, setNodeSize])

  const { width, ref, startResizing } = useResize()

  const visibleCommits = useMemo(() => {
    if (paging) {
      return commits.slice(paging.startIndex, paging.endIndex)
    }

    return commits
  }, [commits, paging])

  const { columnData, virtualColumns } = useColumnData({
    visibleCommits: visibleCommits.length
  })

  const contextValue = useMemo<GraphContextBag>(() => ({
    showCommitNodeTooltips,
    showCommitNodeHashes,
    nodeTheme,
    nodeSize,
    graphWidth: graphWidth + virtualColumns,
    orientation,
    visibleCommits,
    columnData
  }), [showCommitNodeTooltips, showCommitNodeHashes, nodeTheme, nodeSize, graphWidth, virtualColumns, orientation, visibleCommits, columnData])

  return (
    <GraphContext value={contextValue}>
      <div className={styles.container} style={{ width }} ref={ref}>
        {children}

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