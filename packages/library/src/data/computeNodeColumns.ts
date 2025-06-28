import { Commit } from 'types/Commit'
import { CommitNodeLocation } from './types'
import { buildNodeGraph } from './buildNodeGraph'
import { ActiveBranches } from './ActiveBranches'
import { ActiveNodes } from './ActiveNodes'

/**
 * Computes the visual positions of commits in a Git log visualisation.
 *
 * @param commits - List of commit objects
 * @param currentBranch - The currently active branch
 * @param children - A map of commit hashes to their child commits
 * @param parents - A map of commit hashes to their parent commits
 * @returns An object containing commit positions, graph width, and edge connections
 */
export const computeNodePositions = <T>(
  commits: Commit<T>[],
  currentBranch: string,
  children: Map<string, string[]>,
  parents: Map<string, string[]>
) => {
  const activeBranches = new ActiveBranches()
  const positions: Map<string, CommitNodeLocation> = new Map<string, CommitNodeLocation>()

  const hashToIndex = new Map(commits.map((entry, i) => [entry.hash, i]))

  const headCommit = commits.find(commit => commit.branch.includes(currentBranch))
  let rowIndex = 1

  // Active nodes track in-progress branches
  const activeNodes = new ActiveNodes()

  if (headCommit) {
    activeNodes.enqueue([hashToIndex.get(headCommit.hash)!, 'index'])
  }

  for (const commit of commits) {
    let columnIndex = -1
    const commitHash = commit.hash

    const childHashes = children.get(commitHash) ?? []
    const branchChildren = childHashes.filter(childHash => parents.get(childHash)![0] === commitHash)
    const mergeChildren = childHashes.filter(childHash => parents.get(childHash)![0] !== commitHash)

    // Compute invalid column indices
    let highestChild: string | undefined
    let iMin = Infinity
    for (const childSha of mergeChildren) {
      const iChild = positions.get(childSha)![0]
      if (iChild < iMin) {
        iMin = rowIndex
        highestChild = childSha
      }
    }
    const invalidIndices = highestChild ? activeNodes.get(highestChild) : new Set<number>()

    // Find a commit to replace as the active one
    let commitToReplaceHash: string | null = null
    let commitToReplaceColumn = Infinity

    if (commitHash === headCommit?.hash) {
      commitToReplaceHash = 'index'
      commitToReplaceColumn = 0
    } else {
      // The commit can only replace a child whose first parent is this commit
      for (const childHash of branchChildren) {
        const childColumn = positions.get(childHash)![1]
        if (!invalidIndices.has(childColumn) && childColumn < commitToReplaceColumn) {
          commitToReplaceHash = childHash
          commitToReplaceColumn = childColumn
        }
      }
    }

    // Insert the commit in the active branches
    if (commitToReplaceHash) {
      columnIndex = commitToReplaceColumn
      activeBranches.setHash(columnIndex, commitHash)
    } else if (childHashes.length > 0) {
      const childHash = childHashes[0]
      const childColumn = positions.get(childHash)![1]
      columnIndex = activeBranches.insertCommit(commitHash, childColumn, invalidIndices)
    } else {
      columnIndex = activeBranches.insertCommit(commitHash, 0, new Set())
    }

    // Remove outdated active nodes
    activeNodes.removeOutdatedNodes(rowIndex)

    // Update active nodes with the new commit
    const columnToAdd = [columnIndex, ...branchChildren.map(childHash => positions.get(childHash)![1])]
    activeNodes.update(columnToAdd)

    activeNodes.initialiseNewColumn(commitHash)

    const parentIndices = commit.parents.map(parentHash => hashToIndex.get(parentHash)!)
    const highestParentIndex: [number, string] = [Math.max(...parentIndices), commitHash]
    activeNodes.enqueue(highestParentIndex)

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
