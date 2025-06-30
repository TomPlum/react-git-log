import { ThemeMode } from '@tomplum/react-git-log'

export interface DemoContextBag {
  search?: string
  setSearch: (value: string) => void
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}