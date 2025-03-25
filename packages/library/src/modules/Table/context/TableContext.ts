import { createContext } from 'react'
import { TableContextBag } from 'modules/Table/context/types'

export const TableContext = createContext<TableContextBag>({
  timestampFormat: 'YYYY-MM-DD HH:mm:ss'
})