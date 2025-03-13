import { CSSProperties } from 'react'
import { Theme } from 'modules/Visualiser/hooks/useTheme'

export interface GitLogVisualiserProps {
  /**
   * The git log entries to visualise
   * on the graph.
   */
  entries: GitLogEntry[]

  /**
   * An array of colours to use for
   * the branches.
   */
  colours?: string[]

  /**
   * The variant of the default colour
   * them to apply to the visualiser.
   *
   * Does not take effect if a custom
   * array of {@link colours} are passed.
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
   * Optional padding to add to the container
   * to offset how closely the graph is drawn
   * from the edges.
   */
  padding?: {
    top?: number
    left?: number
  }

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
  classes?: {
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
  }
}

export interface Commit {
  hash: string
  parents: string[]
  refs: string
  branch: string
  message: string
  x: number
  y: number
  date: string
  isBranchTip: boolean
}

export interface GitLogEntry {
  hash: string
  branch: string
  parents: string[]
  refs: string
  message: string
  date: string
}

export const ROW_HEIGHT = 48