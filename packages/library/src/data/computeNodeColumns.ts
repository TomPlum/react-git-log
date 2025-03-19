import FastPriorityQueue from 'fastpriorityqueue'
import { Commit } from 'types'
import { CommitNodeLocation } from './types'
import { buildNodeGraph } from './buildNodeGraph'
import { ActiveBranches } from './ActiveBranches'

const activeBranches = new ActiveBranches()

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

  const hashToIndex = new Map(commits.map((entry, i) => [entry.hash, i]))

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
      activeBranches.setHash(columnIndex, commitHash)
    } else {
      if (childHashes.length > 0) {
        const childHash = childHashes[0]
        const childColumn = positions.get(childHash)![1]
        columnIndex = activeBranches.insertCommit(commitHash, childColumn, forbiddenIndices)
      } else {
        columnIndex = activeBranches.insertCommit(commitHash, 0, new Set())
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
        activeBranches.removeHash(positions.get(childSha)![1])
      }
    })

    // If commit has no parents, remove it from active branches
    if (commit.parents.length === 0) {
      activeBranches.removeHash(columnIndex)
    }

    // Store the computed position
    positions.set(commitHash, [rowIndex, columnIndex])
    rowIndex++
  }

  return {
    positions,
    graphWidth: activeBranches.length,
    edges: buildNodeGraph(positions, commits)
  }
}
