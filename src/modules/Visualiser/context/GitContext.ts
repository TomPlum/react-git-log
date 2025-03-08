import { createContext } from 'react'
import { GitContextBag } from 'modules/Visualiser/context/types'
import { GRAPH_LEFT_OFFSET, GRAPH_TOP_OFFSET } from 'modules/Visualiser/components/GitGraph'

export const GitContext = createContext<GitContextBag>({
  colours: [
    'rgb(242, 94, 53)',
    'rgb(102, 245, 83)',
    'rgb(83,183,245)',
    'rgb(245,237,83)',
    'rgb(245,159,57)',
    'rgb(240,83,245)',
    'rgb(150,56,241)'
  ],
  showCommitNodeHashes: false,
  entries: [],
  padding: {
    top: GRAPH_TOP_OFFSET,
    left: GRAPH_LEFT_OFFSET
  },
  showGitLog: true,
  showBranchesTags: true
})