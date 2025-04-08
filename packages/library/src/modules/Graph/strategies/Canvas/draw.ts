import { Commit } from 'types/Commit'
import { ROW_HEIGHT } from 'constants/constants'
import { GraphPaging } from 'context/GitContext'
import { GraphData } from 'data'

export interface DrawProps {
  ctx: CanvasRenderingContext2D
  commits: Commit[]
  rowSpacing: number
  paging?: GraphPaging,
  graphData: GraphData
  nodeSize: number
  getGraphColumnColour: (index: number) => string
}

export const draw = (props: DrawProps) => {
  drawEdges(props)
  drawCommitNodes(props)
}

const drawCommitNodes = ({ ctx, graphData, getGraphColumnColour, rowSpacing, nodeSize }: DrawProps) => {
  graphData.positions.forEach(([rowIndex, columnIndex]) => {
    ctx.beginPath()

    const { x, y, r } = getNodeCoordinates({ nodeSize, columnIndex, rowIndex, rowSpacing })
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = getGraphColumnColour(columnIndex)

    ctx.fill()
  })
}

const drawEdges = ({ ctx, graphData, commits, rowSpacing, nodeSize, getGraphColumnColour }: DrawProps) => {
  graphData.edges.search(0, commits.length).forEach(([[rowStart, colStart], [rowEnd, colEnd], edgeType]) => {
    ctx.beginPath()
    ctx.lineWidth = 2

    const { x: x0, y: y0, r } = getNodeCoordinates({
      rowIndex: rowStart,
      columnIndex: colStart,
      rowSpacing,
      nodeSize
    })

    const { x: x1, y: y1 } = getNodeCoordinates({
      rowIndex: rowEnd,
      columnIndex: colEnd,
      rowSpacing,
      nodeSize
    })

    ctx.moveTo(x0, y0)

    const strokeColumn = colStart != colEnd && edgeType === 'Merge' ? colEnd : colStart
    ctx.strokeStyle = getGraphColumnColour(strokeColumn)

    // If we're drawing a line between two nodes that
    // are in different branches (columns)
    if (colStart != colEnd) {
      if (edgeType === 'Merge') {
        if (colStart < colEnd) {
          ctx.lineTo(x1 - r, y0)
          ctx.quadraticCurveTo(x1, y0, x1, y0 + r)
        } else {
          ctx.lineTo(x1 + r, y0)
          ctx.quadraticCurveTo(x1, y0, x1, y0 + r)
        }
      } else {
        if (colStart < colEnd) {
          ctx.lineTo(x0, y1 - r)
          ctx.quadraticCurveTo(x0, y1, x0 + r, y1)
        } else {
          ctx.lineTo(x0, y1 - r)
          ctx.quadraticCurveTo(x0, y1, x0 - r, y1)
        }
      }
    }

    ctx.lineTo(x1, y1)
    ctx.stroke()
  })
}

const getNodeCoordinates = ({ nodeSize, columnIndex, rowIndex, rowSpacing }: { nodeSize: number, rowSpacing: number, rowIndex: number, columnIndex: number}) => {
  const xOffset = 4
  const leftOffset = nodeSize / 2
  const x = leftOffset + ((xOffset + nodeSize) * columnIndex)

  const yOffset = (ROW_HEIGHT / 2) + rowSpacing
  const y = yOffset + (rowIndex * ROW_HEIGHT)

  const nodeRadius = nodeSize / 2 // nodeSize is diameter

  return {
    x,
    y,
    r: nodeRadius
  }
}