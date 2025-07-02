import { Commit } from 'types/Commit'
import { GitLogEntry } from 'types/GitLogEntry'
import { GitContextBag } from 'context/GitContext'
import { ThemeFunctions } from 'hooks/useTheme'
import { GraphData } from 'data'
import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'
import { GraphContextBag } from 'modules/Graph/context'
import { ThemeContextBag } from 'context/ThemeContext'

export const commit = <T = unknown>(commit?: Partial<Commit<T>>): Commit<T> => ({
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
}) as Commit<T>

export const entry = (entry?: Partial<GitLogEntry>): GitLogEntry => ({
  hash: 'aa2c148',
  committerDate: '2025-02-24T22:06:22+00:00',
  authorDate: '2025-02-22 22:06:22 +0000',
  message: 'feat(graph): example commit message',
  parents: [],
  branch: 'refs/remotes/origin/gh-pages',
  ...entry
})

export const gitContextBag = (bag?: Partial<GitContextBag>): GitContextBag => ({
  currentBranch: 'main',
  graphWidth: 0,
  setGraphWidth: vi.fn(),
  indexCommit: commit({ hash: 'index' }),
  paging: { endIndex: 0, startIndex: 0 },
  isIndexVisible: false,
  isServerSidePaginated: false,
  rowSpacing: 0,
  setPreviewedCommit: vi.fn(),
  setSelectedCommit: vi.fn(),
  showBranchesTags: false,
  showTable: true,
  selectedCommit: commit({ hash: 'selected' }),
  headCommit: commit({ hash: 'HEAD' }),
  graphData: graphData(),
  showHeaders: true,
  graphOrientation: 'normal',
  setGraphOrientation: vi.fn(),
  nodeSize: 20,
  setNodeSize: vi.fn(),
  headCommitHash: '123',
  enableSelectedCommitStyling: true,
  enablePreviewedCommitStyling: true,
  indexStatus: {
    deleted: 0,
    modified: 0,
    added: 0
  },
  ...bag
})

export const themeContextBag = (bag?: Partial<ThemeContextBag>): ThemeContextBag => ({
  theme: 'dark',
  colours: ['white'],
  ...bag
})

export const graphContextBag = (bag?: Partial<GraphContextBag>): GraphContextBag => ({
  nodeTheme: 'default',
  showCommitNodeTooltips: false,
  showCommitNodeHashes: false,
  graphWidth: 200,
  nodeSize: 20,
  orientation: 'normal',
  visibleCommits: [],
  columnData: new Map(),
  breakPointTheme: 'dot',
  isHeadCommitVisible: true,
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
  getCommitNodeColours: vi.fn().mockReturnValue({
    borderColour: 'black',
    backgroundColor: 'gray'
  }),
  getGraphColumnSelectedBackgroundColour: vi.fn(),
  ...response
})

export const graphData = (data?: Partial<GraphData>): GraphData => ({
  positions: new Map(),
  graphWidth: 5,
  commits: [],
  hashToCommit: new Map(),
  parents: new Map(),
  edges: [],
  children: new Map(),
  ...data
})

export const graphColumnState = (state?: Partial<GraphColumnState>): GraphColumnState => ({
  isNode: false,
  isPlaceholderSkeleton: false,
  isLeftUpCurve: false,
  isLeftDownCurve: false,
  isHorizontalLine: false,
  isVerticalLine: false,
  isVerticalIndexLine: false,
  isColumnBelowEmpty: false,
  isColumnAboveEmpty: false,
  ...state
})