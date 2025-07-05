import { useMemo } from 'react'
import { useGitContext } from 'context/GitContext'
import { GraphColumnData, GraphColumnDataProps } from './types'
import { GraphMatrixBuilder } from 'modules/Graph/strategies/Grid/GraphMatrixBuilder'

export const useColumnData = ({ visibleCommits }: GraphColumnDataProps): GraphColumnData => {
  const {
    paging,
    headCommit,
    headCommitHash,
    isIndexVisible,
    isServerSidePaginated,
    graphData: { graphWidth, positions, edges, commits }
  } = useGitContext()

  const { rowToColumnState, virtualColumns } = useMemo(() => {
    const matrixBuilder = new GraphMatrixBuilder({
      commits,
      positions,
      headCommit,
      graphWidth,
      visibleCommits,
      headCommitHash,
      isIndexVisible
    })

    matrixBuilder.drawEdges(edges)
    positions.forEach(position => matrixBuilder.drawNode(position))
    matrixBuilder.checkPostRenderBreakPoints()
    matrixBuilder.drawIndexPseudoCommitEdge()

    if (isServerSidePaginated) {
      matrixBuilder.drawOffPageVirtualEdges()
    }

    matrixBuilder.markFirstRow(paging ? paging.startIndex + 1 : 1)
    matrixBuilder.markLastRow(paging ? paging.endIndex : visibleCommits)

    return {
      rowToColumnState: matrixBuilder.matrix.value,
      virtualColumns: matrixBuilder.virtualColumns
    }
  }, [positions, edges, commits, headCommit, isIndexVisible, isServerSidePaginated, paging, visibleCommits, graphWidth, headCommitHash])

  return {
    columnData: rowToColumnState,
    virtualColumns
  }
}