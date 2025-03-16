import IntervalTree from 'node-interval-tree'
import FastPriorityQueue from 'fastpriorityqueue'
import { Commit } from 'modules/Visualiser'

/**
 * A tuple containing coordinates
 * of a commit node in the git graph;
 *
 *   1. The index of the row in the graph.
 *   2. The index of the column in that row.
 */
export type CommitNodeLocation = [number, number];

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
export type GraphEdge = [CommitNodeLocation, CommitNodeLocation, EdgeType];

/**
 * Computes the visual positions of commits in a Git log visualization.
 *
 * @param commits - List of commit objects
 * @param currentBranch - The currently active branch
 * @param children - A map of commit hashes to their child commits
 * @param parents - A map of commit hashes to their parent commits
 * @returns An object containing commit positions, graph width, and edge connections
 */
export const computeNodePositions = (
  commits: Commit[],
  currentBranch: string,
  children: Map<string, string[]>,
  parents: Map<string, string[]>
) => {
  const positions: Map<string, CommitNodeLocation> = new Map<string, CommitNodeLocation>()

  // Represents active branches. Each index corresponds to a column in the visualization.
  const branches: (string | null)[] = ['index']
  const edges = new IntervalTree<GraphEdge>()

  const hashToIndex = new Map(commits.map((entry, i) => [entry.hash, i]))

  /**
   * Inserts a commit into the nearest available column in the visualization.
   *
   * @param hash The SHA1 hash of the commit we're inserting.
   * @param columnIndex The initial index of the column where we want to place the commit.
   * @param forbiddenIndices A set of indices where the commit cannot be placed.
   */
  const insertCommit = (hash: string, columnIndex: number, forbiddenIndices: Set<number>) => {
    // How far we're going to try searching from the initial column index
    let columnDelta = 1

    // While there are still available positions to the left or right...
    while (columnIndex - columnDelta >= 0 || columnIndex + columnDelta < branches.length) {
      const isRightForbidden = forbiddenIndices.has(columnIndex + columnDelta)
      const isRightEmpty = branches[columnIndex + columnDelta] === null

      // Check if we can place the commit on the right-hand side
      if (columnIndex + columnDelta < branches.length && isRightEmpty && !isRightForbidden) {
        branches[columnIndex + columnDelta] = hash
        return columnIndex + columnDelta // Place to the right
      }

      const isLeftForbidden = forbiddenIndices.has(columnIndex - columnDelta)
      const isLeftEmpty = branches[columnIndex - columnDelta] === null

      // If not, check the left-hand side
      if (columnIndex - columnDelta >= 0 && isLeftEmpty && !isLeftForbidden) {
        branches[columnIndex - columnDelta] = hash
        return columnIndex - columnDelta // Place to the left
      }

      columnDelta++
    }

    branches.push(hash)
    return branches.length - 1
  }

  const headCommitHash = commits.find(commit => commit.branch.includes(currentBranch))!.hash
  let rowIndex = 1

  // Active nodes track in-progress branches
  const activeNodes = new Map<string, Set<number>>()
  const activeNodesQueue = new FastPriorityQueue<[number, string]>((lhs, rhs) => lhs[0] < rhs[0])
  activeNodes.set('index', new Set<number>())
  activeNodesQueue.add([hashToIndex.get(headCommitHash)!, 'index'])

  for (const commit of commits) {
    let columnIndex = -1
    const commitHash = commit.hash

    const childHashes = children.get(commitHash) ?? []
    const branchChildren = childHashes.filter(childHash => parents.get(childHash)![0] === commitHash)
    const mergeChildren = childHashes.filter(childHash => parents.get(childHash)![0] !== commitHash)

    // Compute forbidden column indices
    let highestChild: string | undefined
    let iMin = Infinity
    for (const childSha of mergeChildren) {
      const iChild = positions.get(childSha)![0]
      if (iChild < iMin) {
        iMin = rowIndex
        highestChild = childSha
      }
    }
    const forbiddenIndices = highestChild ? activeNodes.get(highestChild)! : new Set<number>()

    // Find a commit to replace
    let commitToReplaceHash: string | null = null
    let commitToReplaceColumn = Infinity

    if (commitHash === headCommitHash) {
      commitToReplaceHash = 'index'
      commitToReplaceColumn = 0
    } else {
      // The commit can only replace a child whose first parent is this commit
      for (const childHash of branchChildren) {
        const childColumn = positions.get(childHash)![1]
        if (!forbiddenIndices.has(childColumn) && childColumn < commitToReplaceColumn) {
          commitToReplaceHash = childHash
          commitToReplaceColumn = childColumn
        }
      }
    }

    // Insert the commit in the active branches
    if (commitToReplaceHash) {
      columnIndex = commitToReplaceColumn
      branches[columnIndex] = commitHash
    } else {
      if (childHashes.length > 0) {
        const childHash = childHashes[0]
        const childColumn = positions.get(childHash)![1]
        columnIndex = insertCommit(commitHash, childColumn, forbiddenIndices)
      } else {
        columnIndex = insertCommit(commitHash, 0, new Set())
      }
    }

    // Remove outdated active nodes
    while (!activeNodesQueue.isEmpty() && activeNodesQueue.peek()![0] < rowIndex) {
      const activeNodeHash = activeNodesQueue.poll()![1]
      activeNodes.delete(activeNodeHash)
    }

    // Update active nodes with the new commit
    const columnToAdd = [columnIndex, ...branchChildren.map(childHash => positions.get(childHash)![1])]
    activeNodes.forEach(activeNode => columnToAdd.forEach(column => activeNode.add(column)))
    activeNodes.set(commitHash, new Set<number>())
    activeNodesQueue.add([Math.max(...commit.parents.map(parentHash => hashToIndex.get(parentHash)!)), commitHash])

    // Remove children from active branches
    branchChildren.forEach(childSha => {
      if (childSha !== commitToReplaceHash) {
        branches[positions.get(childSha)![1]] = null
      }
    })

    // If commit has no parents, remove it from active branches
    if (commit.parents.length === 0) {
      branches[columnIndex] = null
    }

    // Store the computed position
    positions.set(commitHash, [rowIndex, columnIndex])
    rowIndex++
  }

  // Updates the interval tree with computed edges between commits
  for (const [commitHash, [rowStart, columnStart]] of positions) {
    const parentHashes = commits.find(it => it.hash === commitHash)!.parents
    for (const [parentIndex, parentHash] of parentHashes.entries()) {
      const [rowTarget, columnTarget] = positions.get(parentHash)!
      const edgeType = parentIndex > 0 ? EdgeType.Merge : EdgeType.Normal
      edges.insert(rowStart, rowTarget, [[rowStart, columnStart], [rowTarget, columnTarget], edgeType])
    }
  }

  return {
    positions,
    graphWidth: branches.length,
    edges
  }
}
