import IntervalTree from 'node-interval-tree'
import { CommitNodeLocation, EdgeType, GraphEdge } from './types'
import { Commit } from 'types/Commit'

/**
 * Constructs a graph representation of commit relationships using an interval tree.
 *
 * @param positions - A map where each commit hash maps to its position in the graph as `[row, column]`.
 * @param commits - An array of commit objects, each containing a hash and its parent hashes.
 * @returns An `IntervalTree` containing edges that represent commit relationships.
 */
export const buildNodeGraph = (
  positions: Map<string, CommitNodeLocation>,
  commits: Commit[]
) => {
  const graph = new IntervalTree<GraphEdge>()

  for (const [commitHash, [rowStart, columnStart]] of positions) {
    const parentHashes = commits.find(it => it.hash === commitHash)!.parents

    for (const [parentIndex, parentHash] of parentHashes.entries()) {
      const [rowTarget, columnTarget] = positions.get(parentHash)!
      const edgeType = parentIndex > 0 ? EdgeType.Merge : EdgeType.Normal
      graph.insert(rowStart, rowTarget, [[rowStart, columnStart], [rowTarget, columnTarget], edgeType])
    }
  }

  return graph
}