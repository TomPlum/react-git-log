import { CSSProperties } from 'react'
import { ThemeColours, ThemeMode } from './hooks/useTheme/types'

export interface GitLogProps {
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
   * them to apply to the log.
   */
  theme?: ThemeMode

  /**
   * An array of colours used to colour the
   * logs elements such as the graph.
   *
   * One colour will be used for each column
   * in the graph. The number of columns is
   * equal to the maximum number of concurrent
   * active branches in the log.
   *
   * If the number of colours passed is not enough
   * then the columns will loop back round and start
   * taking from the beginning of the array again.
   */
  colours?: ThemeColours | string[]

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
   * @example https://github.com/TomPlum/react-git-log
   */
  githubRepositoryUrl?: string

  /**
   * The default width of the graph in pixels.
   *
   * Can be changed dynamically if {@link enableResize}
   * is true.
   *
   * @default 300
   */
  defaultGraphWidth?: number

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
  classes?: GitLogStylingProps

  /**
   * Optional paging information to show
   * a window of the given size from the
   * set of git log entries.
   */
  paging?: GitLogPaging
}

export interface GitLogStylingProps {
  /**
   * A class name passed to the wrapping
   * container (div) around the log.
   *
   * This includes the branches/tags, the
   * graph and the git log table.
   */
  containerClass?: string

  /**
   * A React CSS styling object passed to
   * the wrapping container (div) around
   * the log.
   *
   * This includes the branches/tags, the
   * graph and the git log table.
   */
  containerStyles?: CSSProperties

  /**
   * A class name passed to the table
   * element for the git log.
   */
  tableClass?: string

  /**
   * A React CSS styling object passed to
   * the table element for the git log.
   */
  tableStyles?: {
    table?: CSSProperties
    thead?: CSSProperties
    tr?: CSSProperties
    td?: CSSProperties
  }
}

export interface GitLogPaging {
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
  hash: string

  /**
   * An array of parent commit hashes (SHA) for this commit.
   * A commit can have multiple parents in the case of merges.
   */
  parents: string[]

  /**
   * An array of child commit hashes (SHA) that
   * reference this commit as a parent.
   *
   * This helps track descendants in the commit graph.
   */
  children: string[]

  /**
   * The name of the branch this commit belongs to.
   */
  branch: string

  /**
   * The commit message describing the changes
   * introduced by this commit.
   */
  message: string

  /**
   * Details of the user who authored
   * the commit.
   */
  author?: CommitAuthor

  /**
   * The date and time when the commit was
   * made by the author, in ISO 8601 format.
   */
  authorDate?: string

  /**
   * The date and time when the commit was
   * committed to the repository, in ISO 8601 format.
   *
   * This may differ from `authorDate` in cases
   * like rebases or amend commits.
   */
  committerDate: string

  /**
   * Indicates whether this commit is the
   * tip (latest commit) of its branch.
   */
  isBranchTip: boolean
}

/**
 * Represents the author of a Git commit.
 */
export interface CommitAuthor {
  /**
   * The name of the commit author.
   */
  name?: string;

  /**
   * The email address of the commit author.
   */
  email?: string;
}

/**
 * Represents a single entry in the git log.
 */
export interface GitLogEntry {
  /**
   * The unique hash identifier of the commit.
   */
  hash: string

  /**
   * The name of the branch this commit belongs to.
   */
  branch: string

  /**
   * An array of parent commit hashes.
   *
   * - If this commit is a merge commit, it will have multiple parents.
   * - If this commit is an initial commit, it will have no parents.
   */
  parents: string[]

  /**
   * The commit message describing the changes made in this commit.
   */
  message: string

  /**
   * Details of the user who authored
   * the commit.
   */
  author?: CommitAuthor

  /**
   * The date and time when the commit was applied by the committer.
   *
   * This is typically the timestamp when the commit was finalized.
   */
  committerDate: string

  /**
   * The date and time when the commit was originally authored.
   *
   * This may differ from `committerDate` if the commit was rebased or amended.
   */
  authorDate?: string
}