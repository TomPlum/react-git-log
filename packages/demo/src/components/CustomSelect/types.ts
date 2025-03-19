import { ReactNode } from 'react'
import { ThemeMode } from '@tomplum/react-git-log'

export interface CustomSelectProps {
  value: string
  className?: string
  theme: ThemeMode
  width: number
  onChange: (value: string) => void
  options: { label: ReactNode; value: string }[]
}