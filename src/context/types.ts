import { Commit, GitVisualiserStylingProps } from 'modules/Visualiser'
import { Theme } from 'hooks/useTheme'
import { GraphData } from 'modules/GraphData'

export interface GitContextBag {
  colours: string[]

  /**
   * The name of the branch that is
   * currently checked out.
   */
  currentBranch: string

  /**
   * Details of the HEAD commit
   * of the {@link currentBranch}.
   */
  headCommit: Commit

  /**
   * A pseudo-commit that represents
   * the Git index. Most details
   * here are faked so that it can
   * be rendered nicely on the graph.
   */
  indexCommit: Commit

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
   * Enables the graphs horizontal width
   * to be resized.
   */
  enableResize?: boolean

  /**
   * A link to the GitHub repository from which
   * the {@link entries} came from. When passed,
   * link so commits, tags and PRs will be rendered.
   */
  githubRepositoryUrl?: string

  /**
   * The default width of the graph in pixels.
   */
  defaultGraphContainerWidth: number

  /**
   * The width of the graph
   * container in pixels.
   */
  graphContainerWidth: number

  /**
   * Updates the width of the graph
   * container.
   *
   * @param width The new width, in pixels.
   */
  setGraphContainerWidth: (width: number) => void

  /**
   * Data used to render the visualiser
   * components such as the graph, log
   * and tag/branch labels.
   */
  graphData: GraphData

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
  classes?: GitVisualiserStylingProps

  /**
   * The variant of the default colour
   * them to apply to the visualiser.
   *
   * Does not take effect if a custom
   * array of {@link colours} are passed.
   */
  theme: Theme

  /**
   * Optional paging information to show
   * a window of the given size from the
   * set of git log entries.
   */
  paging: {
    /**
     * The zero-based index of the row
     * to show from in the log.
     */
    startIndex: number

    /**
     * The zero-based index of the row
     * to show to in the log.
     */
    endIndex: number

    /**
     * Whether the git index pseudo-commit
     * node is visible. In other words, is
     * index 0 present based on the current
     * pagination config.
     */
    isIndexVisible: boolean
  }
}