import { Commit } from 'types/Commit'

export interface GraphData<T = unknown> {
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
  hashToCommit: Map<string, Commit<T>>

  /**
   * The width of the graph. A number
   * that is the maximum concurrent active
   * branches at any one time from all
   * git log entries passed the log.
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
   * An array containing all the edges
   * for relationships between commits nodes in
   * the graph.
   */
  edges: GraphEdge[]

  /**
   * An array of commit details that have been
   * sorted temporally by committer date.
   */
  commits: Commit<T>[]
}

/**
 * Represents a single edge in the git
 * log graph connecting two commit nodes.
 */
export interface GraphEdge {
  /**
   * The location in the graph of
   * the source node that the edge
   * is to be drawn from.
   */
  from: CommitNodeLocation

  /**
   * The location in the graph of
   * the target node that the edge
   * is to be drawn to.
   */
  to: CommitNodeLocation

  /**
   * The type of edge.
   */
  type: EdgeType

  /**
   * Denotes whether this edge has
   * been rerouted from its actual
   * target node to its nearest ancestor
   * based on commits being filtered
   * from the graph.
   */
  rerouted: boolean
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