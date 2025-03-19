import { ThemeMode } from '@tomplum/react-git-log'

export interface ColourSelection {
  id: string
  colors: string[]
}

export interface ThemeSelectorProps {
  selected: string
  theme: ThemeMode
  onChange: (theme: ColourSelection) => void
}