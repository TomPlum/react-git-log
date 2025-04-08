import { Commit } from 'types/Commit'
import { NODE_BORDER_WIDTH, ROW_HEIGHT } from 'constants/constants'
import { GraphPaging } from 'context/GitContext'
import { GraphData } from 'data'
import { CommitNodeColours } from 'hooks/useTheme'

export interface DrawProps {
  ctx: CanvasRenderingContext2D
  commits: Commit[]
  rowSpacing: number
  paging?: GraphPaging,
  graphData: GraphData
  nodeSize: number
  colours: (columnIndex: number) => CommitNodeColours
}

export const draw = (props: DrawProps) => {
  props.ctx.lineWidth = NODE_BORDER_WIDTH
  drawEdges(props)
  drawCommitNodes(props)
}

const drawCommitNodes = ({ ctx, graphData, colours, rowSpacing, nodeSize }: DrawProps) => {
  graphData.positions.forEach(([rowIndex, columnIndex]) => {
    ctx.beginPath()

    const { x, y, r } = getNodeCoordinates({ nodeSize, columnIndex, rowIndex, rowSpacing })
    ctx.arc(x, y, r, 0, 2 * Math.PI)

    const { backgroundColour, borderColour } = colours(columnIndex)

    ctx.fillStyle = backgroundColour
    ctx.fill()

    ctx.strokeStyle = borderColour
    ctx.stroke()
  })
}

const drawEdges = ({ ctx, graphData, commits, rowSpacing, nodeSize, colours }: DrawProps) => {
  graphData.edges.search(0, commits.length).forEach(([[rowStart, colStart], [rowEnd, colEnd], edgeType]) => {
    ctx.beginPath()

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
    ctx.strokeStyle = colours(strokeColumn).borderColour

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
  const leftOffset = (nodeSize / 2) + NODE_BORDER_WIDTH
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