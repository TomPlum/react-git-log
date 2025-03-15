import { Commit } from 'modules/Visualiser'
import { Edge, Node } from 'modules/GraphData/computeNodeColumns.ts'
import DataIntervalTree from 'node-interval-tree'

export interface GraphData {
  /**
   * A map of the SHA1 commit hash
   * to an array of commit hashes
   * of the child nodes of that
   * commit.
   */
  children: Map<string, string[]>

  /**
   * A map of the SHA1 commit hash
   * to an array of commit hashes
   * of the parent nodes of that
   * commit.
   */
  parents: Map<string, string[]>

  /**
   * A map of the SHA1 commit hash
   * to the details of that commit.
   */
  hashToCommit: Map<string, Commit>

  /**
   * The width of the graph. A number
   * that is the maximum concurrent active
   * branches at any one time from all
   * git log entries passed the visualiser.
   */
  graphWidth: number

  /**
   * A map of the SHA1 hash of a commit
   * and a {@link Node} tuple that contains
   * data about the row and column in which
   * the node for that commit will be
   * rendered in the graph.
   */
  positions: Map<string, Node>

  /**
   * An interval tree containing all the edges
   * for relationships between commit nodes in
   * the graph.
   */
  edges: DataIntervalTree<Edge, number>

  /**
   * An array of commit details that have been
   * sorted temporally by committer date.
   */
  commits: Commit[]
}