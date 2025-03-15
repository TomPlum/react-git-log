import { createContext } from 'react'
import { GitContextBag } from 'modules/Visualiser/context/types'
import { darkThemeColors } from 'modules/Visualiser/hooks/useTheme'
import { Commit } from 'modules/Visualiser'

const defaultCommit: Commit = {
  hash: 'defaultCommit',
  branch: 'unknown',
  parents: [],
  authorDate: new Date().toString(),
  message: 'Working tree index',
  committerDate: new Date().toString(),
  isBranchTip: false,
  refs: 'index',
  x: 0,
  y: 0
}

export const GitContext = createContext<GitContextBag>({
  colours: darkThemeColors,
  showCommitNodeHashes: false,
  commits: [],
  headCommit: defaultCommit,
  indexCommit: defaultCommit,
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