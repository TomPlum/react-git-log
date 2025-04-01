import { Commit } from 'types/Commit'
import { ThemeMode } from 'hooks/useTheme'
import { GraphData } from 'data'
import { GitLogStylingProps } from '../../types'

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
   *
   * Can be undefined if the given git
   * log entries do not include the HEAD
   * commit (probably due to server-side
   * pagination being used)
   */
  headCommit?: Commit

  /**
   * The SHA1 hash of the HEAD commit of
   * the {@link currentBranch} that is checked
   * out in the repository.
   *
   * Only needs to be passed in if you are
   * passing in a sub-set of the Git log
   * {@link entries} due to managing your
   * own pagination.
   *
   * @see {paging} for more info.
   */
  headCommitHash?: string

  /**
   * A pseudo-commit that represents
   * the Git index. Most details
   * here are faked so that it can
   * be rendered nicely on the graph.
   *
   * Will be undefined if the
   * {@link headCommit} is undefined.
   */
  indexCommit?: Commit

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
  showTable: boolean

  /**
   * Whether to show the names of the elements
   * at the top of the component such as "Graph"
   * or "Commit message" etc.
   */
  showHeaders?: boolean

  /**
   * A link to the GitHub repository from which
   * the {@link entries} came from. When passed,
   * link so commits, tags and PRs will be rendered.
   */
  githubRepositoryUrl?: string

  /**
   * The spacing between the rows of the log.
   * Effects all elements across the branches,
   * graph and table.
   *
   * @default 0
   */
  rowSpacing: number

  /**
   * The width of the graph
   * container in pixels.
   */
  graphWidth: number

  /**
   * The diameter, in pixels, of the
   * commit node elements rendered on
   * the graph.
   */
  nodeSize: number

  setNodeSize: (size: number) => void

  /**
   * Updates the width of the graph
   * container.
   *
   * @param width The new width, in pixels.
   */
  setGraphWidth: (width: number) => void

  /**
   * Data used to render the log
   * components such as the graph, table
   * and tag/branch labels.
   */
  graphData: GraphData

  /**
   * CSS Classes to pass to various underlying
   * elements for custom styling.
   */
  classes?: GitLogStylingProps

  /**
   * The variant of the default colour
   * them to apply to the log.
   *
   * Does not take effect if a custom
   * array of {@link colours} are passed.
   */
  theme: ThemeMode

  /**
   * Indicates whether the GitLogPaged
   * variant of the component is being used.
   */
  isServerSidePaginated: boolean

  /**
   * Optional paging information to show
   * a window of the given size from the
   * set of git log entries.
   */
  paging?: {
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
  }

  /**
   * Whether the git index pseudo-commit
   * node is visible. In other words, is
   * index 0 present based on the current
   * pagination config.
   */
  isIndexVisible: boolean
}