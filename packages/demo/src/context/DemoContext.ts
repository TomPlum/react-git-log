import { createContext } from 'react'
import { DemoContextBag } from './types'

export const DemoContext = createContext<DemoContextBag>({
  search: '',
  setSearch: (value: string) => {
    console.warn(`Tried to invoke setSearch(${value}) before the DemoContext was initialised.`)
  }
})