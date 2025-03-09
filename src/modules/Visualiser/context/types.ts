import { GitLogEntry } from 'modules/Visualiser'
import { CSSProperties } from 'react'
import { Theme } from 'modules/Visualiser/hooks/useTheme'

export interface GitContextBag {
  colours: string[]
  
  /**
   * The git log entries to visualise
   * on the graph.
   */
  entries: GitLogEntry[]

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
   * A timestamp format string passed to DayJS
   * to format the timestamps of the commits
   * in the log table.
   */
  timestampFormat: string


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