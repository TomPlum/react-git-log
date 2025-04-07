import { CSSProperties } from 'react'
import { ThemeColours, ThemeMode } from './hooks/useTheme/types'
import { GitLogEntry } from './types/GitLogEntry'
import { Commit } from './types/Commit'

interface GitLogCommonProps {
  /**
   * The git log entries to visualise
   * on the graph.
   */
  entries: GitLogEntry[]

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
  showHeaders?: boolean

  /**
   * The spacing between the rows of the log.
   * Effects all elements across the branches,
   * graph and table.
   *
   * @default 0
   */
  rowSpacing?: number

  /**
   * A function that returns build URI strings
   * to link out to the remote repository on
   * the external Git provider.
   */
  urls?: GitLogUrlBuilder

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
   * The status of changed files in the
   * Git index.
   */
  indexStatus?: GitLogIndexStatus

  /**
   * Whether to show the Git index
   * "pseudo-commit" entry at the top
   * of the log above the HEAD commit.
   *
   * Represents the local working directory
   * and Git index of the currently checked-out
   * branch. Can optionally show metadata of
   * file statuses via {@link indexStatus}
   */
  showGitIndex?: boolean

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
}

export interface GitLogProps extends GitLogCommonProps {
  /**
   * The name of the branch that is
   * currently checked out.
   */
  currentBranch: string

  /**
   * Optional paging information to show
   * a window of the given size from the
   * set of git log entries.
   *
   * This property assumes you are using
   * client-side pagination and that the
   * given {@link entries} include the
   * entire Git log history for the
   * repository.
   *
   * If you wish to use server-side pagination
   * and manage the state yourself, use the
   * {@link GitLogPaged} variation of the
   * component.
   */
  paging?: GitLogPaging
}

export interface GitLogPagedProps extends GitLogCommonProps {
  /**
   * The name of the branch in which the Git log
   * entries belong to.
   */
  branchName: string

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
  headCommitHash: string
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

export interface GitLogIndexStatus {
  /**
   * The number of modified files on
   * the checked-out branch according
   * to the Git index.
   */
  modified: number

  /**
   * The number of added files on
   * the checked-out branch according
   * to the Git index.
   */
  added: number

  /**
   * The number of deleted files on
   * the checked-out branch according
   * to the Git index.
   */
  deleted: number
}

export interface GitLogUrls {
  /**
   * A resolved URL to a particular commit hash
   * on the external Git providers remote website.
   */
  commit?: string

  /**
   * A resolved URL to a branch on the external
   * Git providers remote website.
   */
  branch?: string
}

export interface GitLogUrlBuilderArgs {
  /**
   * Details of the given commit in context
   * of a URL. E.g. the one you clicked on
   * to link out to the external provider.
   */
  commit: Commit
}

/**
 * A function that builds up URLs to the external
 * Git providers website to the remote repository
 * of this log.
 *
 * @param args Contextual commit information to help build the URLs.
 */
export type GitLogUrlBuilder = (args: GitLogUrlBuilderArgs) => GitLogUrls