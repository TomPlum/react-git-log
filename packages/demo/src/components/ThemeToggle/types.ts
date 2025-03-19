import { ThemeMode } from '@tomplum/react-git-log'

export interface ThemeToggleProps {
  theme: ThemeMode
  onChange: (theme: ThemeMode) => void
}