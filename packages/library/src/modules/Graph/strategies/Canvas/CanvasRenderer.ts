import { Commit } from 'types/Commit'
import { CommitNodeLocation, GraphData } from 'data'
import { CommitNodeColours, NodeTheme } from 'hooks/useTheme'
import { NODE_BORDER_WIDTH, ROW_HEIGHT } from 'constants/constants'
import { getMergeNodeInnerSize } from 'modules/Graph/utils/getMergeNodeInnerSize'

export interface CanvasRendererProps {
  ctx: CanvasRenderingContext2D
  commits: Commit[]
  rowSpacing: number
  graphData: GraphData
  nodeSize: number
  nodeTheme: NodeTheme
  canvasHeight: number
  isIndexVisible: boolean
  colours: (columnIndex: number) => CommitNodeColours
}

export class CanvasRenderer {
  private readonly nodeSize: number
  private readonly commits: Commit[]
  private readonly rowSpacing: number
  private readonly canvasHeight: number
  private readonly graphData: GraphData
  private readonly nodeTheme: NodeTheme
  private readonly isIndexVisible: boolean
  private readonly ctx: CanvasRenderingContext2D
  private readonly colours: (columnIndex: number) => CommitNodeColours

  constructor(props: CanvasRendererProps) {
    this.ctx = props.ctx
    this.commits = props.commits
    this.rowSpacing = props.rowSpacing
    this.graphData = props.graphData
    this.nodeSize = props.nodeSize
    this.nodeTheme = props.nodeTheme
    this.isIndexVisible = props.isIndexVisible
    this.colours = props.colours
    this.canvasHeight = props.canvasHeight
  }

  public draw() {
    this.ctx.lineWidth = NODE_BORDER_WIDTH
    this.drawEdges()
    this.drawCommitNodes()
  }

  public drawGitIndex(headCommitLocation: CommitNodeLocation) {
    const [x, y] = [0, 0]
    const lineDash = [2, 1]

    this.ctx.beginPath()

    const { x: xStart, y: yStart } = this.getNodeCoordinates(x, y)
    this.ctx.moveTo(xStart, yStart)

    const { x: xHead, y: yHead } = this.getNodeCoordinates(headCommitLocation[0], headCommitLocation[1])
    this.ctx.lineTo(xHead, yHead)
    this.ctx.strokeStyle = this.colours(y).borderColour
    this.ctx.setLineDash(lineDash)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.drawCommitNode(x, y, lineDash)
    this.ctx.fill()
  }

  private drawCommitNodes() {
    this.graphData.positions.forEach(([rowIndex, columnIndex], hash) => {
      this.drawCommitNode(rowIndex, columnIndex)

      const commit = this.graphData.hashToCommit.get(hash)!
      const isMergeCommit = commit.parents.length > 1 && this.nodeTheme === 'default'
      if (isMergeCommit) {
        this.drawMergeNodeInner(rowIndex, columnIndex)
      }
    })
  }

  private drawEdges() {
    this.graphData.edges.search(0, this.commits.length).forEach(([[rowStart, colStart], [rowEnd, colEnd], edgeType]) => {
      this.ctx.beginPath()

      const { x: x0, y: y0, r } = this.getNodeCoordinates(rowStart, colStart)
      const { x: x1, y: y1 } = this.getNodeCoordinates(rowEnd, colEnd)

      this.ctx.moveTo(x0, y0)

      const strokeColumn = colStart != colEnd && edgeType === 'Merge' ? colEnd : colStart
      const strokeColour = this.colours(strokeColumn).borderColour

      const edgeIsTargetingOffScreenNode = rowEnd > this.commits.length

      if (edgeIsTargetingOffScreenNode) {
        const dx = x1 - x0
        const dy = y1 - y0
        const length = Math.hypot(dx, dy)

        const ux = dx / length
        const uy = dy / length

        const fadeLength = ROW_HEIGHT
        const fadeStartX = x1 - ux * fadeLength
        const fadeStartY = y1 - uy * fadeLength

        const gradient = this.ctx.createLinearGradient(fadeStartX, fadeStartY, x1, y1)
        gradient.addColorStop(0, strokeColour)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        this.ctx.strokeStyle = gradient
      } else {
        this.ctx.strokeStyle = strokeColour
      }

      // If we're drawing a line between two nodes that
      // are in different branches (columns)
      if (colStart != colEnd) {
        if (edgeType === 'Merge') {
          if (colStart < colEnd) {
            this.ctx.lineTo(x1 - r, y0)
            this.ctx.quadraticCurveTo(x1, y0, x1, y0 + r)
          } else {
            this.ctx.lineTo(x1 + r, y0)
            this.ctx.quadraticCurveTo(x1, y0, x1, y0 + r)
          }
        } else {
          if (colStart < colEnd) {
            this.ctx.lineTo(x0, y1 - r)
            this.ctx.quadraticCurveTo(x0, y1, x0 + r, y1)
          } else {
            this.ctx.lineTo(x0, y1 - r)
            this.ctx.quadraticCurveTo(x0, y1, x0 - r, y1)
          }
        }
      }

      if (edgeIsTargetingOffScreenNode) {
        this.ctx.lineTo(x1, this.canvasHeight)
      } else {
        this.ctx.lineTo(x1, y1)
      }

      this.ctx.setLineDash([])
      this.ctx.stroke()
    })
  }

  private getNodeCoordinates(rowIndex: number, columnIndex: number) {
    const xOffset = 4
    const leftOffset = (this.nodeSize / 2) + NODE_BORDER_WIDTH
    const x = leftOffset + ((xOffset + this.nodeSize) * columnIndex)

    const yOffset = (ROW_HEIGHT / 2) + this.rowSpacing
    const rowIndex2 = this.isIndexVisible ? rowIndex : rowIndex - 1
    const y = yOffset + (rowIndex2 * ROW_HEIGHT)

    const nodeRadius = this.nodeSize / 2 // nodeSize is diameter

    return {
      x,
      y,
      r: nodeRadius
    }
  }

  private drawCommitNode(rowIndex: number, columnIndex: number, lineStyle: number[] = []) {
    this.ctx.beginPath()

    const { x, y, r } = this.getNodeCoordinates(rowIndex, columnIndex)
    this.ctx.arc(x, y, r, 0, 2 * Math.PI)

    const { backgroundColour, borderColour } = this.colours(columnIndex)

    this.ctx.fillStyle = backgroundColour
    this.ctx.fill()

    this.ctx.strokeStyle = borderColour
    this.ctx.setLineDash(lineStyle)
    this.ctx.stroke()
  }

  private drawMergeNodeInner(rowIndex: number, columnIndex: number) {
    this.ctx.beginPath()
    const { x, y } = this.getNodeCoordinates(rowIndex, columnIndex)
    const innerDiameter = getMergeNodeInnerSize({ nodeSize: this.nodeSize })
    this.ctx.arc(x, y, innerDiameter / 2, 0, 2 * Math.PI)

    const { borderColour } = this.colours(columnIndex)
    this.ctx.fillStyle = borderColour
    this.ctx.fill()
  }
}