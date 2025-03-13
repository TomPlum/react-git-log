import { createContext } from 'react'
import { GitContextBag } from 'modules/Visualiser/context/types'
import { GRAPH_LEFT_OFFSET, GRAPH_TOP_OFFSET } from 'modules/Visualiser/components/GitGraph'
import { darkThemeColors } from 'modules/Visualiser/hooks/useTheme'
import { Commit } from 'modules/Visualiser'

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
  selectedCommit: undefined,
  setSelectedCommit: (commit?: Commit) => {
    console.debug(`Tried to invoke setSelectedCommit(${JSON.stringify(commit)}) before the GitContext was initialised.`)
  },
  previewedCommit: undefined,
  setPreviewedCommit: (commit?: Commit) => {
    console.debug(`Tried to invoke setPreviewedCommit(${JSON.stringify(commit)}) before the GitContext was initialised.`)
  },
  enableExperimentalAnimation: false
})