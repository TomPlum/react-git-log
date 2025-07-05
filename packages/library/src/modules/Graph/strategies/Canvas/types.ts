import { Commit } from 'types/Commit'
import { GraphData } from 'data'
import { CommitNodeColours, NodeTheme } from 'hooks/useTheme'
import { GraphOrientation } from 'modules/Graph'

export interface MousePosition {
  x: number
  y: number
}

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