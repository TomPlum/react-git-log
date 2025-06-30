import { PropsWithChildren, useEffect, useMemo } from 'react'
import styles from './GraphCore.module.scss'
import { useGitContext } from 'context/GitContext'
import { useColumnData } from 'modules/Graph/strategies/Grid/hooks/useColumnData'
import { useResize } from 'hooks/useResize'
import { DEFAULT_NODE_SIZE } from 'constants/constants'
import { GraphContext, GraphContextBag } from '../context'
import { GraphCoreProps } from 'modules/Graph/core/types'
import { CustomCommitNode } from 'modules/Graph'

export const GraphCore = <T,>({
  node,
  children,
  nodeSize = DEFAULT_NODE_SIZE,
  nodeTheme = 'default',
  orientation = 'normal',
  enableResize = false,
  showCommitNodeHashes = false,
  showCommitNodeTooltips = false,
  highlightedBackgroundHeight
}: PropsWithChildren<GraphCoreProps<T>>) => {
  const {
    paging,
    filter,
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
    const filteredCommits = filter?.(commits) ?? commits

    if (paging) {
      return filteredCommits.slice(paging.startIndex, paging.endIndex)
    }

    return filteredCommits
  }, [commits, filter, paging])

  const { columnData, virtualColumns } = useColumnData({
    visibleCommits: visibleCommits.length
  })

  const contextValue = useMemo<GraphContextBag>(() => ({
    node: node as CustomCommitNode<unknown>,
    showCommitNodeTooltips,
    showCommitNodeHashes,
    nodeTheme,
    nodeSize,
    graphWidth: graphWidth + virtualColumns,
    orientation,
    visibleCommits,
    columnData,
    highlightedBackgroundHeight
  }), [node, showCommitNodeTooltips, showCommitNodeHashes, nodeTheme, nodeSize, graphWidth, virtualColumns, orientation, visibleCommits, columnData, highlightedBackgroundHeight])

  return (
    <GraphContext.Provider value={contextValue}>
      <div className={styles.container} style={{ width }} ref={ref}>
        {children}

        {enableResize && (
          <button
            onMouseDown={startResizing}
            className={styles.dragHandle}
          />
        )}
      </div>
    </GraphContext.Provider>
  )
}