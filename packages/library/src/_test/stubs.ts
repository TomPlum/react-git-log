import { Commit } from 'types'
import { GitContextBag } from 'context/GitContext'
import DataIntervalTree from 'node-interval-tree'
import { ThemeFunctions } from 'hooks/useTheme'

export const commit = (commit?: Partial<Commit>) => ({
  hash: 'aa2c148',
  committerDate: '2025-02-24T22:06:22+00:00',
  authorDate: '2025-02-22 22:06:22 +0000',
  message: 'feat(graph): example commit message',
  parents: [
    'afdb263'
  ],
  branch: 'refs/remotes/origin/gh-pages',
  children: [
    '30ee0ba'
  ],
  isBranchTip: false,
  ...commit
})

export const gitContextBag = (bag?: Partial<GitContextBag>): GitContextBag => ({
  currentBranch: 'main',
  defaultGraphContainerWidth: 0,
  graphContainerWidth: 0,
  indexCommit: commit({ hash: 'index' }),
  paging: { endIndex: 0, isIndexVisible: false, startIndex: 0 },
  rowSpacing: 0,
  setGraphContainerWidth: vi.fn(),
  setPreviewedCommit: vi.fn(),
  setSelectedCommit: vi.fn(),
  showBranchesTags: false,
  showCommitNodeHashes: false,
  theme: 'dark',
  timestampFormat: '',
  showTable: true,
  selectedCommit: commit({ hash: 'selected' }),
  colours: ['white'],
  headCommit: commit({ hash: 'HEAD' }),
  graphData: {
    positions: new Map(),
    graphWidth: 5,
    commits: [],
    hashToCommit: new Map(),
    parents: new Map(),
    edges: new DataIntervalTree(),
    children: new Map()
  },
  ...bag
})

export const themeFunctions = (response?: Partial<ThemeFunctions>): ThemeFunctions => ({
  getGraphColumnColour: vi.fn(),
  shiftAlphaChannel: vi.fn(),
  hoverColour: 'hoverColour',
  theme: 'dark',
  textColour: 'textColour',
  reduceOpacity: vi.fn(),
  getCommitColour: vi.fn(),
  getTooltipBackground: vi.fn(),
  hoverTransitionDuration: 500,
  ...response
})