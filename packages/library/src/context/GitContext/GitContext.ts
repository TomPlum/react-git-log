import { createContext } from 'react'
import { GitContextBag } from './types'
import { neonAuroraDarkColours } from 'hooks/useTheme'
import { Commit } from 'types'
import DataIntervalTree from 'node-interval-tree'

const defaultCommit: Commit = {
  hash: 'defaultCommit',
  branch: 'unknown',
  parents: [],
  children: [],
  authorDate: new Date().toString(),
  message: 'Working tree index',
  committerDate: new Date().toString(),
  isBranchTip: false
}

export const GitContext = createContext<GitContextBag>({
  colours: neonAuroraDarkColours,
  showCommitNodeHashes: false,
  headCommit: defaultCommit,
  indexCommit: defaultCommit,
  currentBranch: 'master',
  showTable: true,
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
  graphContainerWidth: 300,
  defaultGraphContainerWidth: 300,
  setGraphContainerWidth: (width: number) => {
    console.debug(`Tried to invoke setGraphContainerWidth(${width}) before the GitContext was initialised.`)
  },
  paging: {
    endIndex: 0,
    startIndex: 0,
    isIndexVisible: true
  }
})