import { Commit } from 'modules/Visualiser'

export interface GraphColumnProps {
  index: number
  commit: Commit
  state: GraphColumnState
}

export interface GraphColumnState {
  isStartNode: boolean
  isTerminalNode: boolean
  isVerticalMergeLine: boolean
}