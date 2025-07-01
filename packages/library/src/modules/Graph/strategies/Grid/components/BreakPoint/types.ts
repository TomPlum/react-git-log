import { CSSProperties } from 'react'

export interface BreakPointProps {
  position: 'top' | 'bottom'
  className?: string
  color: string
  style?: CSSProperties
}