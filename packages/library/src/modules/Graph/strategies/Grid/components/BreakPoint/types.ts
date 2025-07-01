import { CSSProperties } from 'react'
import { BreakPointTheme } from 'hooks/useTheme'

export interface BreakPointProps {
  position: BreakPointPosition
  className?: string
  color: string
  style?: Partial<Record<BreakPointTheme, CSSProperties>>
}

export type BreakPointPosition = 'top' | 'bottom'