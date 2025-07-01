import { createContext } from 'react'
import { GitContextBag } from './types'
import { Commit } from 'types/Commit'
import DataIntervalTree from 'node-interval-tree'
import { DEFAULT_NODE_SIZE } from 'constants/constants'
import { GraphOrientation } from 'modules/Graph'

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
  headCommit: defaultCommit,
  indexCommit: defaultCommit,
  currentBranch: 'master',
  showTable: true,
  showBranchesTags: true,
  selectedCommit: undefined,
  setSelectedCommit: (commit?: Commit) => {
    console.debug(`Tried to invoke setSelectedCommit(${JSON.stringify(commit)}) before the GitContext was initialised.`)
  },
  previewedCommit: undefined,
  setPreviewedCommit: (commit?: Commit) => {
    console.debug(`Tried to invoke setPreviewedCommit(${JSON.stringify(commit)}) before the GitContext was initialised.`)
  },
  graphOrientation: 'normal',
  setGraphOrientation: (orientation: GraphOrientation) => {
    console.debug(`Tried to invoke setGraphOrientation(${orientation}) before the GitContext was initialised.`)
  },
  graphData: {
    children: new Map(),
    edges: new DataIntervalTree(),
    graphWidth: 0,
    commits: [],
    positions: new Map(),
    parents: new Map(),
    hashToCommit: new Map(),
    filteredData: {
      graphWidth: 0,
      edges: [],
      positions: new Map()
    },
    filteredCommits: []
  },
  rowSpacing: 0,
  graphWidth: 300,
  nodeSize: DEFAULT_NODE_SIZE,
  setNodeSize: (size: number) => {
    console.debug(`Tried to invoke setNodeSize(${size}) before the GitContext was initialised.`)
  },
  setGraphWidth: (width: number) => {
    console.debug(`Tried to invoke setGraphWidth(${width}) before the GitContext was initialised.`)
  },
  isServerSidePaginated: false,
  paging: {
    endIndex: 0,
    startIndex: 0,
  },
  isIndexVisible: true
})