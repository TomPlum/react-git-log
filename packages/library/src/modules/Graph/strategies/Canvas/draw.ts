import { RowIndexToColumnStates } from 'modules/Graph/hooks/useColumnData'
import { Commit } from 'types/Commit'
import { ROW_HEIGHT } from 'constants/constants'
import { getEmptyColumnState } from 'modules/Graph/utility/getEmptyColumnState'
import { GraphPaging } from 'context/GitContext'
import { CommitNodeLocation, GraphData } from 'data'

export interface DrawProps {
  ctx: CanvasRenderingContext2D
  columnData: RowIndexToColumnStates
  commits: Commit[]
  rowSpacing: number
  paging?: GraphPaging,
  graphWidth: number
  graphData: GraphData
  getGraphColumnColour: (index: number) => string
}

export const draw = (props: DrawProps) => {
  drawEdges(props)
  drawCommitNodes(props)
}

const drawCommitNodes = ({ ctx, graphData, getGraphColumnColour }: DrawProps) => {
  graphData.positions.forEach(([rowIndex, columnIndex]) => {
    ctx.beginPath()

    const x = 10 * columnIndex
    const yOffset = ROW_HEIGHT / 2
    const y = yOffset + (rowIndex * ROW_HEIGHT)
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = getGraphColumnColour(columnIndex)
    ctx.fill()
  })
}

const drawEdges = ({ ctx, graphData, commits }: DrawProps) => {
  graphData.edges.search(0, commits.length).forEach(([[rowStart, colStart], [rowEnd, colEnd], edgeType]) => {
    ctx.beginPath()
    ctx.lineWidth = 2

    const x0 = 10 * colStart
    const yOffset = ROW_HEIGHT / 2
    const y0 = yOffset + (rowStart * ROW_HEIGHT)

    const x1 = 10 * colEnd
    const y1 = yOffset + (rowEnd * ROW_HEIGHT)

    ctx.moveTo(x0, y0)

    // If we're drawing a line between two nodes that
    // are in different branches (columns)
    if (colStart != colEnd) {
      if (edgeType === 'Merge') {
        if (colStart < colEnd) {
          ctx.lineTo(x1, y1)
        }
      }
    }
  })
}
