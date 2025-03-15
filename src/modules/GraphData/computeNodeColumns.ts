import IntervalTree from 'node-interval-tree'
import FastPriorityQueue from 'fastpriorityqueue'
import { Commit } from 'modules/Visualiser'

export type Node = [number, number];

export enum EdgeType {
  Normal,
  Merge
}

export type Edge = [[number, number], [number, number], EdgeType];

export const computeNodePositions = (
  entries: Commit[],
  currentBranch: string,
  children: Map<string, string[]>,
  parents: Map<string, string[]>
) => {
  const positions: Map<string, Node> = new Map<string, Node>()

  const branches: (string | null)[] = ['index']
  let edges = new IntervalTree<Edge>()

  const updateIntervalTree = (entries: Commit[]) => {
    edges = new IntervalTree<Edge>()
    for (const [commitSha, [i0, j0]] of positions) {
      const parents = entries.find(it => it.hash === commitSha)!.parents
      for (const [i, parentSha] of parents.entries()) {
        const [i1, j1] = positions.get(parentSha)!
        const data: Edge = [[i0, j0], [i1, j1], i > 0 ? EdgeType.Merge : EdgeType.Normal]
        edges.insert(i0, i1, data)
      }
    }
  }

  const shaToIndex = new Map(entries.map((entry, i) => [entry.hash, i] as [string, number]))

  const insertCommit = (commitSha: string, j: number, forbiddenIndices: Set<number>) => {
    // Try to insert as close as possible to i
    // replace i by j
    let dj = 1
    while (j - dj >= 0 || j + dj < branches.length) {
      if (j + dj < branches.length && branches[j + dj] === null && !forbiddenIndices.has(j + dj)) {
        branches[j + dj] = commitSha
        return j + dj
      } else if (j - dj >= 0 && branches[j - dj] === null && !forbiddenIndices.has(j - dj)) {
        branches[j - dj] = commitSha
        return j - dj
      }
      ++dj
    }
    // If it is not possible to find an available position, append
    branches.push(commitSha)
    return branches.length - 1
  }

  const headSha = entries.find(commit => commit.branch.includes(currentBranch))!.hash
  let rowIndex = 1

  const activeNodes = new Map<string, Set<number>>()
  const activeNodesQueue = new FastPriorityQueue<[number, string]>((lhs, rhs) => lhs[0] < rhs[0])
  activeNodes.set('index', new Set<number>())
  activeNodesQueue.add([shaToIndex.get(headSha)!, 'index'])

  for (const commit of entries) {
    let columnIndex = -1

    const commitSha = commit.hash
    const childrenHashes = children.get(commitSha)!
    const branchChildren = childrenHashes.filter((childHash) => parents.get(childHash)![0] === commitSha)
    const mergeChildren = childrenHashes.filter((childHash) => parents.get(childHash)![0] !== commitSha)

    // Compute forbidden indices
    let highestChild: string | undefined = undefined
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
    let commitToReplace: string | null = null
    let jCommitToReplace = Infinity
    if (commitSha === headSha) {
      commitToReplace = 'index'
      jCommitToReplace = 0
    } else {
      // The commit can only replace a child whose first parent is this commit
      for (const childSha of branchChildren) {
        const jChild = positions.get(childSha)![1]
        if (!forbiddenIndices.has(jChild) && jChild < jCommitToReplace) {
          commitToReplace = childSha
          jCommitToReplace = jChild
        }
      }
    }

    // Insert the commit in the active branches
    if (commitToReplace) {
      columnIndex = jCommitToReplace
      branches[columnIndex] = commitSha
    } else {
      if (childrenHashes.length > 0) {
        const childSha = childrenHashes[0]
        const jChild = positions.get(childSha)![1]
        // Try to insert near a child
        // We could try to insert near any child instead of arbitrarily choosing the first one
        columnIndex = insertCommit(commitSha, jChild, forbiddenIndices)
      } else {
        // TODO: Find a better value for j
        columnIndex = insertCommit(commitSha, 0, new Set())
      }
    }

    // Remove useless active nodes
    while (!activeNodesQueue.isEmpty() && activeNodesQueue.peek()![0] < rowIndex) {
      const sha = activeNodesQueue.poll()![1]
      activeNodes.delete(sha)
    }

    // Update the active nodes
    const jToAdd = [columnIndex, ...branchChildren.map((childSha) => positions.get(childSha)![1])]
    for (const activeNode of activeNodes.values()) {
      jToAdd.forEach((j) => activeNode.add(j))
    }
    activeNodes.set(commitSha, new Set<number>())
    const iRemove = Math.max(...entries.find(it => it.hash === commitSha)!.parents!.map((parentSha) => shaToIndex.get(parentSha)!))
    activeNodesQueue.add([iRemove, commitSha])

    // Remove children from active branches
    branchChildren.forEach(childSha => {
      if (childSha != commitToReplace) {
        branches[positions.get(childSha)![1]] = null
      }
    })

    // If the commit has no parent, remove it from active branches
    if (commit.parents.length === 0) {
      branches[columnIndex] = null
    }

    // Finally set the position
    positions.set(commitSha, [rowIndex, columnIndex])
    rowIndex++
  }

  updateIntervalTree(entries)

  return {
    positions,
    graphWidth: branches.length,
    edges
  }
}