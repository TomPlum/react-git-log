import IntervalTree from 'node-interval-tree'
import FastPriorityQueue from 'fastpriorityqueue'
import { GitLogEntry } from 'modules/Visualiser'

export type Node = [number, number];

export enum EdgeType {
  Normal,
  Merge
}

export type Edge = [[number, number], [number, number], EdgeType];

export const computeNodePositions = (entries: GitLogEntry[]) => {
  const positions: Map<string, Node> = new Map<string, Node>()

  let width = 0
  const branches: (string | null)[] = ['index']
  let edges = new IntervalTree<Edge>()

  const updateIntervalTree = (entries: GitLogEntry[]) => {
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

  positions.clear()
  const headSha = entries[0].hash
  let i = 1

  const activeNodes = new Map<string, Set<number>>()
  const activeNodesQueue = new FastPriorityQueue<[number, string]>((lhs, rhs) => lhs[0] < rhs[0])
  activeNodes.set('index', new Set<number>())
  if (headSha) {
    activeNodesQueue.add([shaToIndex.get(headSha)!, 'index'])
  }
  for (const commit of entries) {
    let j = -1

    const commitSha = commit.hash
    const parentHashes = commit.parents
    const branchChildren = parentHashes.filter((parentHash) => entries.find(it => it.hash === parentHash)!.parents[0] === commitSha)
    const mergeChildren = parentHashes.filter((parentHash) => entries.find(it => it.hash === parentHash)!.parents[0] !== commitSha)

    // Compute forbidden indices
    let highestChild: string | undefined = undefined
    let iMin = Infinity
    for (const childSha of mergeChildren) {
      if (positions.has(childSha)) {
        const iChild = positions.get(childSha)![0]
        if (iChild < iMin) {
          iMin = i
          highestChild = childSha
        }
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
        if (positions.has(childSha)) {
          const jChild = positions.get(childSha)![1]
          if (!forbiddenIndices.has(jChild) && jChild < jCommitToReplace) {
            commitToReplace = childSha
            jCommitToReplace = jChild
          }
        }
      }
    }

    // Insert the commit in the active branches
    if (commitToReplace) {
      j = jCommitToReplace
      branches[j] = commitSha
    } else {
      if (parentHashes.length > 0) {
        const childSha = parentHashes[0]
        if (positions.has(childSha)) {
          const jChild = positions.get(childSha)![1]
          // Try to insert near a child
          // We could try to insert near any child instead of arbitrarily choosing the first one
          j = insertCommit(commitSha, jChild, forbiddenIndices)
        }
      } else {
        // TODO: Find a better value for j
        j = insertCommit(commitSha, 0, new Set())
      }
    }

    // Remove useless active nodes
    while (!activeNodesQueue.isEmpty() && activeNodesQueue.peek()![0] < i) {
      const sha = activeNodesQueue.poll()![1]
      activeNodes.delete(sha)
    }

    // Update the active nodes
    const jToAdd = [j, ...branchChildren.map((childSha) => positions.get(childSha)![1])]
    for (const activeNode of activeNodes.values()) {
      jToAdd.forEach((j) => activeNode.add(j))
    }
    activeNodes.set(commitSha, new Set<number>())
    const iRemove = Math.max(...entries.find(it => it.hash === commitSha)!.parents!.map((parentSha) => shaToIndex.get(parentSha)!))
    activeNodesQueue.add([iRemove, commitSha])

    // Remove children from active branches
    for (const childSha of branchChildren) {
      if (childSha != commitToReplace) {
        branches[positions.get(childSha)![1]] = null
      }
    }

    // If the commit has no parent, remove it from active branches
    if (commit.parents.length === 0) {
      branches[j] = null
    }

    // Finally set the position
    positions.set(commitSha, [i, j])
    ++i
  }
  width = branches.length
  updateIntervalTree(entries)

  return positions
}