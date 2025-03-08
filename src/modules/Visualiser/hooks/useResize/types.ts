import { RefObject } from 'react'

export interface ResizeProps {
  defaultWidth: number
}

export interface ResizeState {
  ref: RefObject<HTMLDivElement | null>
  width: number
  startResizing: () => void
}