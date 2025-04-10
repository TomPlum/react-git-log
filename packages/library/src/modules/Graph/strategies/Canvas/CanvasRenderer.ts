import { Commit } from 'types/Commit'
import { CommitNodeLocation, GraphData } from 'data'
import { CommitNodeColours, NodeTheme } from 'hooks/useTheme'
import { NODE_BORDER_WIDTH, ROW_HEIGHT } from 'constants/constants'
import { getMergeNodeInnerSize } from 'modules/Graph/utils/getMergeNodeInnerSize'
import { GraphOrientation } from 'modules/Graph'
import { getColumnBackgroundSize } from 'modules/Graph/utils/getColumnBackgroundSize'

export interface CanvasRendererProps {
  ctx: CanvasRenderingContext2D
  commits: Commit[]
  rowSpacing: number
  graphData: GraphData
  nodeSize: number
  nodeTheme: NodeTheme
  canvasHeight: number
  canvasWidth: number
  showTable: boolean
  selectedCommit?: Commit
  previewedCommit?: Commit
  previewBackgroundColour: string
  orientation: GraphOrientation
  isIndexVisible: boolean
  colours: (columnIndex: number) => CommitNodeColours
}

export class CanvasRenderer {
  private readonly nodeSize: number
  private readonly commits: Commit[]
  private readonly rowSpacing: number
  private readonly canvasHeight: number
  private readonly canvasWidth: number
  private readonly graphData: GraphData
  private readonly nodeTheme: NodeTheme
  private readonly orientation: GraphOrientation
  private readonly isIndexVisible: boolean
  private readonly showTable: boolean
  private readonly previewBackgroundColour: string
  private readonly ctx: CanvasRenderingContext2D
  private readonly colours: (columnIndex: number) => CommitNodeColours

  private readonly rowToCommitHash = new Map<number, string>
  private readonly rowToCommitColumn = new Map<number, number>

  private readonly previewedCommit: Commit | undefined
  private readonly selectedCommit: Commit | undefined

  constructor(props: CanvasRendererProps) {
    this.ctx = props.ctx
    this.commits = props.commits
    this.rowSpacing = props.rowSpacing
    this.graphData = props.graphData
    this.nodeSize = props.nodeSize
    this.nodeTheme = props.nodeTheme
    this.orientation = props.orientation
    this.isIndexVisible = props.isIndexVisible
    this.showTable = props.showTable
    this.colours = props.colours
    this.canvasHeight = props.canvasHeight
    this.canvasWidth = props.canvasWidth
    this.previewedCommit = props.previewedCommit
    this.selectedCommit = props.selectedCommit
    this.previewBackgroundColour = props.previewBackgroundColour;

    [...props.graphData.positions.entries()].forEach(([hash, location]) => {
      this.rowToCommitColumn.set(location[0], location[1])
      this.rowToCommitHash.set(location[0], hash)
    })
  }

  public draw() {
    this.ctx.lineWidth = NODE_BORDER_WIDTH

    // Backgrounds are drawn first so they're underneath other elements
    if (this.previewedCommit) {
      this.drawBackgroundForCommit(this.previewedCommit, this.previewBackgroundColour)
    }

    if (this.selectedCommit) {
      const commitColourIndex = this.graphData.positions.get(this.selectedCommit.hash)![1]
      this.drawBackgroundForCommit(this.selectedCommit, this.colours(commitColourIndex).backgroundColour)
    }

    this.drawEdges()
    this.drawCommitNodes()
  }

  public drawGitIndex(headCommitLocation: CommitNodeLocation) {
    const [x, y] = [0, 0]
    const lineDash = [2, 2]

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

  public getCommitAtPosition(x: number, y: number) {
    const location = this.getRowColFromCoordinates(x, y)

    if (location !== null) {
      const commitHash = this.rowToCommitHash.get(location.rowIndex)
      return commitHash ? this.graphData.hashToCommit.get(commitHash) : undefined
    }

    return undefined
  }

  public drawBackgroundForCommit(commit: Commit, colour: string) {
    if (commit.hash === 'index') {
      this.drawColumnBackground(0, colour)
    } else {
      const location = this.graphData.positions.get(commit.hash)

      if (location) {
        this.drawColumnBackground(location[0], colour)
      }
    }
  }

  private drawColumnBackground(rowIndex: number, colour: string) {
    const nodeColumn = this.rowToCommitColumn.get(rowIndex)!
    const nodeCoordinates = this.getNodeCoordinates(rowIndex, nodeColumn)

    if (this.showTable) {
      const height = ROW_HEIGHT - 4 // Doesn't seem to be correct in the canvas
      const leftOffset = 8
      const cornerRadius = height / 2
      const nodeRadius = this.nodeSize / 2
      const x = nodeCoordinates.x - nodeRadius - leftOffset
      const y = nodeCoordinates.y - (height / 2)

      this.ctx.beginPath()
      this.ctx.moveTo(x + cornerRadius, y)
      this.ctx.lineTo(this.canvasWidth, y)
      this.ctx.lineTo(this.canvasWidth, y + height)
      this.ctx.lineTo(x + cornerRadius, y + height)
      this.ctx.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius)
      this.ctx.lineTo(x, y + cornerRadius)
      this.ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius)
      this.ctx.closePath()
      this.ctx.fillStyle = colour
      this.ctx.fill()
    } else {
      const radius = getColumnBackgroundSize({ nodeSize: this.nodeSize })
      
      this.ctx.beginPath()
      this.ctx.arc(nodeCoordinates.x, nodeCoordinates.y, radius, 0, 2 * Math.PI)
      this.ctx.closePath()
      this.ctx.fillStyle = colour
      this.ctx.fill()
    }
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
        this.ctx.strokeStyle = this.createFadeGradient(x1, x0, y1, y0, strokeColour)
      } else {
        this.ctx.strokeStyle = strokeColour
      }

      // If we're drawing a line between two nodes that
      // are in different branches (columns)
      if (colStart !== colEnd) {
        const isNormal = this.orientation === 'normal'
        const isMerge = edgeType === 'Merge'
        const isForward = colStart < colEnd

        const dir = isForward ? 1 : -1
        const flip = isNormal ? 1 : -1

        if (isMerge) {
          this.ctx.lineTo(x1 - r * dir * flip, y0)
          this.ctx.quadraticCurveTo(x1, y0, x1, y0 + r)
        } else {
          this.ctx.lineTo(x0, y1 - r)
          this.ctx.quadraticCurveTo(x0, y1, x0 + r * dir * flip, y1)
        }
      }

      // Else, we're drawing a straight line down one column.
      if (edgeIsTargetingOffScreenNode) {
        this.ctx.lineTo(x1, this.canvasHeight)
      } else {
        this.ctx.lineTo(x1, y1)
      }

      this.ctx.setLineDash([])
      this.ctx.stroke()
    })
  }

  private createFadeGradient(x1: number, x0: number, y1: number, y0: number, strokeColour: string) {
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

    return gradient
  }

  private getNodeCoordinates(rowIndex: number, columnIndex: number) {
    const xOffset = 4
    const leftOffset = (this.nodeSize / 2) + NODE_BORDER_WIDTH
    const normalisedColIndex = this.orientation === 'normal'
      ? columnIndex
      : this.graphData.graphWidth - 1 - columnIndex
    const x = leftOffset + ((xOffset + this.nodeSize) * normalisedColIndex)

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

  private getRowColFromCoordinates(x: number, y: number): { rowIndex: number, columnIndex: number } | null {
    const xOffset = 4
    const leftOffset = (this.nodeSize / 2) + NODE_BORDER_WIDTH
    const nodeStrideX = this.nodeSize + xOffset

    const yOffset = (ROW_HEIGHT / 2) + this.rowSpacing
    const nodeStrideY = ROW_HEIGHT

    const normalisedColIndex = Math.floor((x - leftOffset + (nodeStrideX / 2)) / nodeStrideX)
    if (normalisedColIndex < 0 || normalisedColIndex >= this.graphData.graphWidth) {
      return null
    }

    const columnIndex = this.orientation === 'normal'
      ? normalisedColIndex
      : this.graphData.graphWidth - 1 - normalisedColIndex

    const rawRowIndex = Math.floor((y - yOffset + (ROW_HEIGHT / 2)) / nodeStrideY)
    const rowIndex = this.isIndexVisible ? rawRowIndex : rawRowIndex + 1

    if (rowIndex < 0 || rowIndex >= this.canvasHeight) {
      return null
    }

    return {
      rowIndex,
      columnIndex
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