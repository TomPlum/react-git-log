import { createContext } from 'react'
import { GitContextBag } from 'modules/Visualiser/context/types'
import { darkThemeColors } from 'modules/Visualiser/hooks/useTheme'
import { Commit } from 'modules/Visualiser'

export const GitContext = createContext<GitContextBag>({
  colours: darkThemeColors,
  showCommitNodeHashes: false,
  commits: [],
  currentBranch: 'master',
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