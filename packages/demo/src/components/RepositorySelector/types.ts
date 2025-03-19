import { ThemeMode } from '@tomplum/react-git-log'

export interface RepositorySelectorProps {
  selected: string
  theme: ThemeMode
  onSelect: (selected: string) => void
}