import { Commit } from 'modules/Visualiser'
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
   * and a {@link CommitNodeLocation} tuple that contains
   * data about the row and column in which
   * the node for that commit will be
   * rendered in the graph.
   */
  positions: Map<string, CommitNodeLocation>

  /**
   * An interval tree containing all the edges
   * for relationships between commit nodes in
   * the graph.
   */
  edges: DataIntervalTree<GraphEdge, number>

  /**
   * An array of commit details that have been
   * sorted temporally by committer date.
   */
  commits: Commit[]
}

/**
 * A tuple containing coordinates
 * of a commit node in the git graph;
 *
 *   1. The index of the row in the graph.
 *   2. The index of the column in that row.
 */
export type CommitNodeLocation = [number, number]

/**
 * The type of edge between two nodes
 * on the graph.
 */
export enum EdgeType {
  Normal = 'Normal',
  Merge = 'Merge'
}

/**
 * A tuple containing coordinates and other
 * metadata for a connecting branch or merge
 * line on the commit {@link Graph}.
 *
 *   1. The source nodes location.
 *   2. The target nodes location.
 *   3. The type of edge.
 */
export type GraphEdge = [CommitNodeLocation, CommitNodeLocation, EdgeType]