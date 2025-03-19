export interface ColourSelection {
  id: string
  colors: string[]
}

export interface ThemeSelectorProps {
  selected: string
  onChange: (theme: ColourSelection) => void
}