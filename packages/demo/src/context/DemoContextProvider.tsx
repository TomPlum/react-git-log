import { PropsWithChildren, useMemo, useState } from 'react'
import { DemoContextBag } from './types'
import { DemoContext } from './DemoContext'
import { ThemeMode } from '@tomplum/react-git-log'

export const DemoContextProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useState<string>()
  const [theme, setTheme] = useState<ThemeMode>('dark')

  const value = useMemo<DemoContextBag>(() => ({
    search,
    setSearch,
    theme,
    setTheme
  }), [search, theme])

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}