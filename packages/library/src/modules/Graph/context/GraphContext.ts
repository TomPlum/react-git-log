import { createContext } from 'react'
import { GraphContextBag } from './types'

export const GraphContext = createContext<GraphContextBag>({
  showCommitNodeHashes: false,
  showCommitNodeTooltips: false,
  nodeTheme: 'default'
})