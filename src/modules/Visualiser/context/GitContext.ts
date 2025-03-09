import { createContext } from 'react'
import { GitContextBag } from 'modules/Visualiser/context/types'
import { GRAPH_LEFT_OFFSET, GRAPH_TOP_OFFSET } from 'modules/Visualiser/components/GitGraph'
import { darkThemeColors } from 'modules/Visualiser/hooks/useTheme'

export const GitContext = createContext<GitContextBag>({
  colours: darkThemeColors,
  showCommitNodeHashes: false,
  entries: [],
  padding: {
    top: GRAPH_TOP_OFFSET,
    left: GRAPH_LEFT_OFFSET
  },
  showGitLog: true,
  showBranchesTags: true,
  theme: 'light',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss',
})