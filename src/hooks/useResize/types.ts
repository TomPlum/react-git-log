import { RefObject } from 'react'

export interface ResizeState {
  ref: RefObject<HTMLDivElement | null>
  width: number
  startResizing: () => void
}