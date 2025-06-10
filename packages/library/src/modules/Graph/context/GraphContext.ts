import { createContext } from 'react'
import { GraphContextBag } from './types'

export const GraphContext = createContext<GraphContextBag>({
  showCommitNodeHashes: false,
  showCommitNodeTooltips: false,
  nodeTheme: 'default',
  nodeSize: 24,
  graphWidth: 0,
  orientation: 'normal',
  visibleCommits: [],
  columnData: new Map()
})