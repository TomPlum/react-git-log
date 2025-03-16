import { CSSProperties } from 'react'
import { Theme } from 'hooks/useTheme'

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
   * Enables the graphs horizontal width
   * to be resized.
   *
   * @default false
   */
  enableResize?: boolean

  /**
   * The spacing between the rows of the log.
   * Effects all elements across the branches,
   * graph and table.
   *
   * @default 0
   */
  rowSpacing?: number

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
   *
   * @default 400
   */
  defaultGraphContainerWidth?: number

  /**
   * A timestamp format string passed to DayJS
   * to format the timestamps of the commits
   * in the log table.
   *
   * @default ISO-8601
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
  /**
   * The number of rows to show in
   * each page.
   */
  size: number

  /**
   * The page number to show.
   * The first page is page 0.
   */
  page: number
}

/**
 * Represents a commit in the Git history.
 */
export interface Commit {
  /**
   * The unique hash (SHA) identifying the commit.
   */
  hash: string;

  /**
   * An array of parent commit hashes (SHA) for this commit.
   * A commit can have multiple parents in the case of merges.
   */
  parents: string[];

  /**
   * An array of child commit hashes (SHA) that
   * reference this commit as a parent.
   *
   * This helps track descendants in the commit graph.
   */
  children: string[];

  /**
   * A string representing references associated with the commit,
   * such as branch names or tags.
   */
  refs: string;

  /**
   * The name of the branch this commit belongs to.
   */
  branch: string;

  /**
   * The commit message describing the changes
   * introduced by this commit.
   */
  message: string;

  /**
   * The date and time when the commit was
   * made by the author, in ISO 8601 format.
   */
  authorDate: string;

  /**
   * The date and time when the commit was
   * committed to the repository, in ISO 8601 format.
   *
   * This may differ from `authorDate` in cases
   * like rebases or amend commits.
   */
  committerDate: string;

  /**
   * Indicates whether this commit is the
   * tip (latest commit) of its branch.
   */
  isBranchTip: boolean;
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