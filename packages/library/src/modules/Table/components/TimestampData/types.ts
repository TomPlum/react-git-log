import { CSSProperties } from 'react'

export interface TimestampDataProps {
  index: number;
  isPlaceholder: boolean
  timestamp: string
  style: CSSProperties
}