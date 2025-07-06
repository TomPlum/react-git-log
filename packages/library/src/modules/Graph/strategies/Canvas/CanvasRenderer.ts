import { Commit } from 'types/Commit'
import { CommitNodeLocation, EdgeType, GraphData } from 'data'
import { CommitNodeColours, NodeTheme } from 'hooks/useTheme'
import { NODE_BORDER_WIDTH, ROW_HEIGHT } from 'constants/constants'
import { getMergeNodeInnerSize } from 'modules/Graph/utils/getMergeNodeInnerSize'
import { GraphOrientation } from 'modules/Graph'
import { getColumnBackgroundSize } from 'modules/Graph/utils/getColumnBackgroundSize'
import { MousePosition } from 'modules/Graph/strategies/Canvas/types'

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
  selectedCommitHash?: string
  previewedCommitHash?: string
  previewBackgroundColour: string
  orientation: GraphOrientation
  isIndexVisible: boolean
  isServerSidePaginated: boolean
  indexCommit?: Commit
  headCommit?: Commit
  getColours: GetCanvasRendererColoursFunction
}

export type GetCanvasRendererColoursFunction = (columnIndex: number) => CanvasRenderersColours

export interface CanvasRenderersColours {
  commitNode: CommitNodeColours
  selectedColumnBackgroundColour: string
  indexCommitColour: string
}

export class CanvasRenderer {
  private readonly ctx: CanvasRenderingContext2D

  private readonly commits: Commit[]
  private readonly graphData: GraphData
  private readonly rowToCommitHash = new Map<number, string>
  private readonly rowToCommitColumn = new Map<number, number>

  private readonly nodeSize: number
  private readonly nodeTheme: NodeTheme
  private readonly rowSpacing: number
  private readonly orientation: GraphOrientation
  private readonly isIndexVisible: boolean
  private readonly showTable: boolean
  private readonly isServerSidePaginated: boolean

  private readonly canvasHeight: number
  private readonly canvasWidth: number

  private readonly getColours: GetCanvasRendererColoursFunction
  private readonly previewBackgroundColour: string

  private readonly previewedCommitHash: string | undefined
  private readonly selectedCommitHash: string | undefined
  private readonly headCommit: Commit | undefined
  private readonly indexCommit: Commit | undefined
  private readonly indexCommitLocation: CommitNodeLocation = [0, 0]

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
    this.isServerSidePaginated = props.isServerSidePaginated
    this.getColours = props.getColours
    this.canvasHeight = props.canvasHeight
    this.canvasWidth = props.canvasWidth
    this.previewedCommitHash = props.previewedCommitHash
    this.selectedCommitHash = props.selectedCommitHash
    this.headCommit = props.headCommit
    this.indexCommit = props.indexCommit
    this.previewBackgroundColour = props.previewBackgroundColour;

    [...props.graphData.positions.entries()].forEach(([hash, location]) => {
      this.rowToCommitColumn.set(location[0], location[1])
      this.rowToCommitHash.set(location[0], hash)
    })
  }

  public draw() {
    this.ctx.lineWidth = NODE_BORDER_WIDTH

    // Backgrounds are drawn first so they're underneath other elements
    if (this.previewedCommitHash) {
      this.drawColumnBackground(this.previewedCommitHash, this.previewBackgroundColour)
    }

    // Backgrounds are drawn first so they're underneath other elements
    if (this.selectedCommitHash) {
      const backgroundColour = this.getSelectedCommitBackgroundColour(this.selectedCommitHash)
      this.drawColumnBackground(this.selectedCommitHash, backgroundColour)
    }

    if (this.isIndexVisible) {
      this.drawGitIndex()
    }

    // Then edges, so they sit under the commit nodes
    this.drawEdges()

    // Then draw edges for nodes referenced off the page
    if (this.isServerSidePaginated) {
      this.drawVirtualNodeEdges()
    }

    // Then finally the commit nodes on top
    this.drawCommitNodes()
  }

  public getCommitAtPosition(position: MousePosition) {
    const location = this.getRowColFromCoordinates(position.x, position.y)

    if (location !== null) {
      if (location.rowIndex === 0 && this.indexCommit) {
        return this.indexCommit
      }

      const commitHash = this.rowToCommitHash.get(location.rowIndex)
      return commitHash ? this.graphData.hashToCommit.get(commitHash) : undefined
    }

    return undefined
  }

  private drawGitIndex() {
    const [x, y] = this.indexCommitLocation
    const lineDash = [2, 2]

    this.ctx.beginPath()

    const { x: xStart, y: yStart } = this.getNodeCoordinates(x, y)
    this.ctx.moveTo(xStart, yStart)

    if (this.headCommit && this.graphData.positions.has(this.headCommit.hash)) {
      const [headRow, headCol] = this.graphData.positions.get(this.headCommit.hash)!
      const { x: xHead, y: yHead } = this.getNodeCoordinates(headRow, headCol)

      this.ctx.lineTo(xHead, yHead)
      this.ctx.strokeStyle = this.getColours(y).indexCommitColour
      this.ctx.setLineDash(lineDash)
      this.ctx.stroke()

      this.ctx.beginPath()
      this.drawCommitNode(x, y, lineDash, true)
      this.ctx.fill()
    }
  }

  private drawColumnBackground(commitHash: string, colour: string) {
    const location = commitHash === 'index'
      ? this.indexCommitLocation
      : this.graphData.positions.get(commitHash)

    if (!location) {
      return
    }

    const rowIndex = location[0]
    const gitIndexColumn = this.normaliseColumnIndex(0)
    const nodeColumn = commitHash === 'index' ? gitIndexColumn : this.rowToCommitColumn.get(rowIndex)!
    const nodeCoordinates = this.getNodeCoordinates(rowIndex, nodeColumn)

    if (this.showTable) {
      const height = ROW_HEIGHT - 4 // Doesn't seem correct in the canvas
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
      this.ctx.globalAlpha = 1
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
    this.graphData.edges.forEach(({ from: [rowStart, colStart], to: [rowEnd, colEnd], type }) => {
      this.drawEdgeBetweenNodes(rowStart, colStart, rowEnd, colEnd, type)
    })
  }

  private drawVirtualNodeEdges() {
    let virtualColumns = 0

    const commitsWithUntrackedParents = this.graphData.commits.filter(({ parents }) => {
      return parents.some(parentHash => {
        return !this.graphData.positions.has(parentHash)
      })
    })

    const drawVerticalLineToBottom = (fromCommitHash: string) => {
      const [rowIndex, columnIndex] = this.graphData.positions.get(fromCommitHash)!
      const bottomRowIndex = this.commits.length + 1
      this.drawEdgeBetweenNodes(rowIndex, columnIndex, bottomRowIndex, columnIndex, EdgeType.Normal)
    }

    // Non-merge commits we can just draw straight down to the edge of the graph
    commitsWithUntrackedParents.filter(commit => commit.parents.length === 1).forEach(orphan => {
      drawVerticalLineToBottom(orphan.hash)
    })

    // Merge commits may have lines coming out horizontally and then down to the bottom.
    // Or we may find they can draw straight down if there is free space below to the bottom.
    commitsWithUntrackedParents
      .filter(commit => commit.parents.length > 1)
      .sort((a, b) => {
        const aPosition = this.graphData.positions.get(a.hash)![0]
        const bPosition = this.graphData.positions.get(b.hash)![0]
        return aPosition < bPosition ? -1 : 1
      })
      .forEach(orphan => {
        const [rowIndex, columnIndex] = this.graphData.positions.get(orphan.hash)!

        // Can we just draw straight down in the current column?
        let columnsBelowContainNode = false
        let targetRowIndex = rowIndex + 1
        while(targetRowIndex <= this.commits.length) {
          if (this.rowToCommitColumn.get(targetRowIndex) === columnIndex) {
            columnsBelowContainNode = true
          }

          targetRowIndex++
        }

        if (!columnsBelowContainNode && rowIndex != this.commits.length) {
          drawVerticalLineToBottom(orphan.hash)
        } else {
          // Find the nearest column to the right that is empty
          const virtualColumnTargetIndex = (this.graphData.graphWidth - 1) + virtualColumns
          this.drawEdgeBetweenNodes(rowIndex, columnIndex, targetRowIndex, virtualColumnTargetIndex, EdgeType.Merge)
          virtualColumns++
        }
      })

    // Any commits who have child hashes that are not present in the graph and
    // are not the HEAD commit, must have vertical lines drawn from them up to
    // the top row to indicate that the child commit node is before the rows currently shown.
    this.graphData.commits.filter(commit => {
      return commit.children.length === 0 && commit.hash !== this.headCommit?.hash
    }).forEach(commitWithNoChildren => {
      const [rowIndex, columnIndex] = this.graphData.positions.get(commitWithNoChildren.hash)!
      this.drawEdgeBetweenNodes(rowIndex, columnIndex, 0, columnIndex, EdgeType.Normal)
    })

    // TODO: First and last nodes dont draw their vertical lines up or down?
  }

  private drawEdgeBetweenNodes(rowStart: number, colStart: number, rowEnd: number, colEnd: number, edgeType: EdgeType) {
    this.ctx.beginPath()

    const { x: x0, y: y0, r } = this.getNodeCoordinates(rowStart, colStart)
    const { x: x1, y: y1 } = this.getNodeCoordinates(rowEnd, colEnd)

    this.ctx.moveTo(x0, y0)

    const strokeColumn = colStart !== colEnd && edgeType === 'Merge' ? colEnd : colStart
    const strokeColour = this.getColours(strokeColumn).commitNode.borderColour

    const edgeRunsOffTheBottom = rowEnd > this.commits.length
    const edgeRunsOffTheTop = rowEnd <= 0

    if (edgeRunsOffTheBottom) {
      this.ctx.strokeStyle = this.createFadeGradient(x1, x0, y1, y0, strokeColour)
    } else if (edgeRunsOffTheTop) {
      this.ctx.strokeStyle = this.createFadeGradient(x0, x1, y1, y0, strokeColour)
    } else {
      this.ctx.strokeStyle = strokeColour
    }

    // If we're drawing a line between two nodes that
    // are in different branches (columns)
    if (colStart !== colEnd) {
      const isNormalOrientation = this.orientation === 'normal'
      const isMerge = edgeType === 'Merge'
      const isForward = colStart < colEnd

      const dir = isForward ? 1 : -1
      const flip = isNormalOrientation ? 1 : -1

      if (isMerge) {
        this.ctx.lineTo(x1 - r * dir * flip, y0)
        this.ctx.quadraticCurveTo(x1, y0, x1, y0 + r)
      } else {
        this.ctx.lineTo(x0, y1 - r)
        this.ctx.quadraticCurveTo(x0, y1, x0 + r * dir * flip, y1)
      }
    }

    // Else, we're drawing a straight line down one column.
    if (edgeRunsOffTheBottom) {
      this.ctx.lineTo(x1, this.canvasHeight)
    } else {
      this.ctx.lineTo(x1, y1)
    }

    this.ctx.setLineDash([])
    this.ctx.stroke()
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
    const normalisedColIndex = this.normaliseColumnIndex(columnIndex)
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

    const columnIndex = Math.floor((x - leftOffset + (nodeStrideX / 2)) / nodeStrideX)
    if (columnIndex < 0 || columnIndex >= this.graphData.graphWidth) {
      return null
    }

    const normalisedColIndex = this.normaliseColumnIndex(columnIndex)

    const rawRowIndex = Math.floor((y - yOffset + (ROW_HEIGHT / 2)) / nodeStrideY)
    const rowIndex = this.isIndexVisible ? rawRowIndex : rawRowIndex + 1

    if (rowIndex < 0 || rowIndex >= this.canvasHeight) {
      return null
    }

    return {
      rowIndex,
      columnIndex: normalisedColIndex
    }
  }

  private drawCommitNode(rowIndex: number, columnIndex: number, lineStyle: number[] = [], isIndex: boolean = false) {
    this.ctx.beginPath()

    const { x, y, r } = this.getNodeCoordinates(rowIndex, columnIndex)
    this.ctx.arc(x, y, r, 0, 2 * Math.PI)

    const defaultColours = this.getColours(columnIndex)
    const { backgroundColour, borderColour } = isIndex
      ? { backgroundColour: defaultColours.commitNode.backgroundColour, borderColour: defaultColours.indexCommitColour }
      : defaultColours.commitNode

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

    const { borderColour } = this.getColours(columnIndex).commitNode
    this.ctx.fillStyle = borderColour
    this.ctx.fill()
  }

  private getSelectedCommitBackgroundColour(hash: string) {
    if (hash === 'index') {
      return this.getColours(0).selectedColumnBackgroundColour
    }

    const commitColourIndex = this.graphData.positions.get(hash)![1]
    return this.getColours(commitColourIndex).selectedColumnBackgroundColour
  }

  private normaliseColumnIndex(columnIndex: number) {
    return this.orientation === 'normal'
      ? columnIndex
      : this.graphData.graphWidth - 1 - columnIndex
  }
}