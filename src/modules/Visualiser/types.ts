import { CSSProperties } from 'react'
import { Theme } from 'modules/Visualiser/hooks/useTheme'

export interface GitLogVisualiserProps {
  /**
   * The git log entries to visualise
   * on the graph.
   */
  entries: GitLogEntry[]

  /**
   * The name of the branch that is
   * currently checked out.
   */
  currentBranch: string

  /**
   * The variant of the default colour
   * them to apply to the visualiser.
   */
  theme?: Theme

  /**
   * Whether to show labels for the nodes
   * that are the tips of branches or
   * tags with the graph.
   */
  showBranchesTags?: boolean

  /**
   * Whether to show a table of commit metadata
   * on the right-hand side of the graph.
   */
  showGitLog?: boolean

  /**
   * Whether to show the commit hash
   * to the side of the node in the graph.
   */
  showCommitNodeHashes?: boolean

  /**
   * Whether to show tooltips when hovering
   * over a commit node in the graph.
   */
  showCommitNodeTooltips?: boolean

  /**
   * Whether to show the names of the elements
   * at the top of the component such as "Graph"
   * or "Commit message" etc.
   */
  showTableHeaders?: boolean

  /**
   * Enables framer motion animation for
   * simple fading transitions when interacting
   * with the graph or log.
   *
   * This feature is experimental and may
   * have bugs.
   */
  enableExperimentalAnimation?: boolean

  /**
   * A link to the GitHub repository from which
   * the {@link entries} came from. When passed,
   * link so commits, tags and PRs will be rendered.
   *
   * @example https://github.com/TomPlum/git-log-visualiser
   */
  githubRepositoryUrl?: string

  /**
   * The default width of the graph in pixels.
   */
  graphWidth?: number

  /**
   * A timestamp format string passed to DayJS
   * to format the timestamps of the commits
   * in the log table.
   */
  timestampFormat?: string

  /**
   * A callback function invoked when a commit
   * is selected from the graph or log table.
   *
   * The commit is undefined if it has been
   * un-selected.
   *
   * @param commit Details of the selected commit.
   */
  onSelectCommit?: (commit?: Commit) => void

  /**
   * CSS Classes to pass to various underlying
   * elements for custom styling.
   */
  classes?: GitVisualiserStylingProps

  /**
   * Optional paging information to show
   * a window of the given size from the
   * set of git log entries.
   */
  paging?: GitVisualiserPaging
}

export interface GitVisualiserStylingProps {
  /**
   * A class name passed to the wrapping
   * container (div) around the visualiser.
   *
   * This includes the branches/tags, the
   * graph and the git log table.
   */
  containerClass?: string

  /**
   * A React CSS styling object passed to
   * the wrapping container (div) around
   * the visualiser.
   *
   * This includes the branches/tags, the
   * graph and the git log table.
   */
  containerStyles?: CSSProperties

  /**
   * A class name passed to the table
   * element for the git log.
   */
  logTableClass?: string

  /**
   * A React CSS styling object passed to
   * the table element for the git log.
   */
  logTableStyles?: {
    table?: CSSProperties
    thead?: CSSProperties
    tr?: CSSProperties
    td?: CSSProperties
  }
}

export interface GitVisualiserPaging {
  size: number
  page: number
}

export interface Commit {
  hash: string
  parents: string[]
  children: string[]
  refs: string
  branch: string
  message: string
  committerDate: string
  authorDate: string
  isBranchTip: boolean
}

/**
 * A single entry from your repositories
 * git log.
 *
 * TODO: Can we make some fields optional here? Is refs needed?
 */
export interface GitLogEntry {
  hash: string
  branch: string
  parents: string[]
  refs: string
  message: string
  committerDate: string
  authorDate: string
}

export const ROW_HEIGHT = 40