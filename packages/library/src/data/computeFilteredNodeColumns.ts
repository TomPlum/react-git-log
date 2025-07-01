import { Commit } from 'types/Commit'
import { ActiveBranches } from './ActiveBranches'
import { CommitNodeLocation } from './types'
import { ActiveNodes } from './ActiveNodes'

export const computeFilteredNodePositions = <T>(
  commits: Commit<T>[],
  currentBranch: string,
  children: Map<string, string[]>,
  parents: Map<string, string[]>,
  filteredCommits?: Commit<T>[]
) => {
  const activeBranches = new ActiveBranches()
  const positions: Map<string, CommitNodeLocation> = new Map()
  const hashToIndex = new Map(commits.map((entry, i) => [entry.hash, i]))
  const visibleHashes = new Set(filteredCommits?.map(c => c.hash) ?? commits.map(c => c.hash))

  const headCommit = commits.find(commit => commit.branch.includes(currentBranch))
  let rowIndex = 1
  const activeNodes = new ActiveNodes()

  if (headCommit) {
    activeNodes.enqueue([hashToIndex.get(headCommit.hash)!, 'index'])
  }

  for (const commit of commits) {
    let columnIndex = -1
    const commitHash = commit.hash

    const childHashes = children.get(commitHash) ?? []
    const branchChildren = childHashes.filter(childHash => parents.get(childHash)?.[0] === commitHash)
    const mergeChildren = childHashes.filter(childHash => parents.get(childHash)?.[0] !== commitHash)

    let highestChild: string | undefined
    let iMin = Infinity
    for (const childSha of mergeChildren) {
      const iChild = positions.get(childSha)?.[0] ?? Infinity
      if (iChild < iMin) {
        iMin = rowIndex
        highestChild = childSha
      }
    }
    const invalidIndices = highestChild ? activeNodes.get(highestChild) : new Set<number>()

    let commitToReplaceHash: string | null = null
    let commitToReplaceColumn = Infinity

    if (commitHash === headCommit?.hash) {
      commitToReplaceHash = 'index'
      commitToReplaceColumn = 0
    } else {
      for (const childHash of branchChildren) {
        const childColumn = positions.get(childHash)?.[1] ?? Infinity
        if (!invalidIndices.has(childColumn) && childColumn < commitToReplaceColumn) {
          commitToReplaceHash = childHash
          commitToReplaceColumn = childColumn
        }
      }
    }

    if (commitToReplaceHash) {
      columnIndex = commitToReplaceColumn
      activeBranches.setHash(columnIndex, commitHash)
    } else if (childHashes.length > 0) {
      const childHash = childHashes[0]
      const childColumn = positions.get(childHash)?.[1] ?? 0
      columnIndex = activeBranches.insertCommit(commitHash, childColumn, invalidIndices)
    } else {
      columnIndex = activeBranches.insertCommit(commitHash, 0, new Set())
    }

    activeNodes.removeOutdatedNodes(rowIndex)
    const columnsToAdd = [columnIndex, ...branchChildren.map(c => positions.get(c)?.[1] ?? 0)]
    activeNodes.update(columnsToAdd)
    activeNodes.initialiseNewColumn(commitHash)

    const parentIndices = commit.parents.map(p => hashToIndex.get(p)!).filter(i => i !== undefined)
    const highestParentIndex: [number, string] = [Math.max(...parentIndices), commitHash]
    activeNodes.enqueue(highestParentIndex)

    branchChildren.forEach(c => {
      if (c !== commitToReplaceHash) {
        const pos = positions.get(c)
        if (pos) activeBranches.removeHash(pos[1])
      }
    })

    if (commit.parents.length === 0) {
      activeBranches.removeHash(columnIndex)
    }

    positions.set(commitHash, [rowIndex, columnIndex])
    rowIndex++
  }

  const filteredHashes = filteredCommits?.map(c => c.hash) ?? commits.map(c => c.hash)
  const filteredRows = [...filteredHashes]
    .map(hash => [hash, positions.get(hash)] as const)
    .filter(([, pos]) => !!pos) as [string, CommitNodeLocation][]

  const rowMap = new Map(
    filteredRows.map(([hash, [, col]], i) => [hash, [i + 1, col] as CommitNodeLocation])
  )

  const findClosestVisibleAncestor = (() => {
    const cache = new Map<string, string | undefined>()

    const dfs = (hash: string): string | undefined => {
      if (cache.has(hash)) return cache.get(hash)
      const parentHashes = parents.get(hash)
      if (!parentHashes || parentHashes.length === 0) {
        cache.set(hash, undefined)
        return undefined
      }

      for (const parentHash of parentHashes) {
        if (visibleHashes.has(parentHash)) {
          cache.set(hash, parentHash)
          return parentHash
        }
      }

      for (const parentHash of parentHashes) {
        const ancestor = dfs(parentHash)
        if (ancestor) {
          cache.set(hash, ancestor)
          return ancestor
        }
      }

      cache.set(hash, undefined)
      return undefined
    }

    return dfs
  })()

  const filteredEdges = filteredCommits ?? commits
  const edges = filteredEdges.flatMap(source => {
    const output: { from: CommitNodeLocation; to: CommitNodeLocation; rerouted: boolean }[] = []

    for (const parentHash of source.parents) {
      const fromPos = rowMap.get(source.hash)
      const toHash = visibleHashes.has(parentHash)
        ? parentHash
        : findClosestVisibleAncestor(parentHash)

      const toPos = toHash ? rowMap.get(toHash) : undefined

      if (fromPos && toPos) {
        output.push({
          from: fromPos,
          to: toPos,
          rerouted: toHash !== parentHash,
        })
      }
    }

    return output
  })

  return {
    positions: rowMap,
    graphWidth: activeBranches.length,
    edges
  }
}