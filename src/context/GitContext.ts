import { createContext } from 'react'
import { GitContextBag } from './types'
import { darkThemeColors } from 'hooks/useTheme'
import { Commit } from 'modules/Visualiser'
import DataIntervalTree from 'node-interval-tree'

const defaultCommit: Commit = {
  hash: 'defaultCommit',
  branch: 'unknown',
  parents: [],
  children: [],
  authorDate: new Date().toString(),
  message: 'Working tree index',
  committerDate: new Date().toString(),
  isBranchTip: false,
  refs: 'index'
}

export const GitContext = createContext<GitContextBag>({
  colours: darkThemeColors,
  showCommitNodeHashes: false,
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
  enableExperimentalAnimation: false,
  graphData: {
    children: new Map(),
    edges: new DataIntervalTree(),
    graphWidth: 0,
    commits: [],
    positions: new Map(),
    parents: new Map(),
    hashToCommit: new Map()
  },
  rowSpacing: 0,
  graphContainerWidth: 400,
  defaultGraphContainerWidth: 400,
  setGraphContainerWidth: (width: number) => {
    console.debug(`Tried to invoke setGraphContainerWidth(${width}) before the GitContext was initialised.`)
  },
  paging: {
    endIndex: 0,
    startIndex: 0,
    isIndexVisible: true
  }
})