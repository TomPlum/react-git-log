import { Commit } from 'modules/Visualiser'
import { CSSProperties } from 'react'
import { Theme } from 'modules/Visualiser/hooks/useTheme'

export interface GitContextBag {
  colours: string[]

  /**
   * The commits from the git log
   * currently in context.
   */
  commits: Commit[]

  /**
   * The currently selected commit that
   * is highlighted in the log.
   */
  selectedCommit?: Commit

  /**
   * Sets the selected commit. Can be
   * undefined to clear the selection.
   *
   * @param commit Details of the selected commit.
   */
  setSelectedCommit: (commit?: Commit) => void

  /**
   * The currently previewed commit that
   * is temporarily highlighted in the log
   * while the user is hovering their cursor
   * over it.
   */
  previewedCommit?: Commit

  /**
   * Sets the previewed commit. Can be
   * undefined to clear the selection.
   *
   * @param commit Details of the selected commit.
   */
  setPreviewedCommit: (commit?: Commit) => void

  /**
   * Whether to show labels for the nodes
   * that are the tips of branches or
   * tags with the graph.
   */
  showBranchesTags: boolean

  /**
   * Whether to show a table of commit metadata
   * on the right-hand side of the graph.
   */
  showGitLog: boolean

  /**
   * Whether to show the commit hash
   * to the side of the node in the graph.
   */
  showCommitNodeHashes: boolean

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
  timestampFormat: string

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

  /**
   * The variant of the default colour
   * them to apply to the visualiser.
   *
   * Does not take effect if a custom
   * array of {@link colours} are passed.
   */
  theme: Theme
}