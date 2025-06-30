import { createContext } from 'react'
import { DemoContextBag } from './types'
import { ThemeMode } from '@tomplum/react-git-log'

export const DemoContext = createContext<DemoContextBag>({
  search: '',
  setSearch: (value: string) => {
    console.warn(`Tried to invoke setSearch(${value}) before the DemoContext was initialised.`)
  },
  theme: 'dark',
  setTheme: (theme: ThemeMode) => {
    console.warn(`Tried to invoke setTheme(${theme}) before the DemoContext was initialised.`)
  }
})