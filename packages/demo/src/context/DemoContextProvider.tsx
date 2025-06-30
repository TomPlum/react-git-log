import { PropsWithChildren, useMemo, useState } from 'react'
import { DemoContextBag } from './types'
import { DemoContext } from './DemoContext'

export const DemoContextProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useState<string>()

  const value = useMemo<DemoContextBag>(() => ({
    search,
    setSearch
  }), [search])

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}