import { Commit } from 'types/Commit'
import { ActiveBranches } from './ActiveBranches'
import { CommitNodeLocation, EdgeType, GraphEdge } from './types'
import { ActiveNodes } from './ActiveNodes'

export interface GraphDataBuilderProps<T> {
  commits: Commit<T>[],
  currentBranch: string,
  children: Map<string, string[]>
  parents: Map<string, string[]>
  filteredCommits?: Commit<T>[]
}

/**
 * Computes the visual positions of commits in a Git log visualisation.
 *
 * @param commits - List of commit objects
 * @param currentBranch - The currently active branch
 * @param children - A map of commit hashes to their child commits
 * @param parents - A map of commit hashes to their parent commits
 * @param filteredCommits A list of commit objects after running them through the filter
 *
 * @returns An object containing commit positions, graph width, and edge connections
 */
export class GraphDataBuilder<T> {
  private readonly _activeBranches = new ActiveBranches()
  private readonly _activeNodes = new ActiveNodes()
  private readonly ancestorFinder: AncestorFinder

  private readonly _positions = new Map<string, CommitNodeLocation>()
  private readonly _commits: Commit<T>[]
  private readonly _filteredCommits: Commit<T>[] | undefined

  private readonly _children: Map<string, string[]>
  private readonly _parents: Map<string, string[]>

  private readonly _hashToIndex: Map<string, number>
  private readonly _visibleHashes: Set<string>

  private readonly _headCommit: Commit<T> | undefined
  private rowIndex = 1

  constructor(props: GraphDataBuilderProps<T>) {
    this._commits = props.commits
    this._parents = props.parents
    this._children = props.children
    this._filteredCommits = props.filteredCommits

    this._headCommit = props.commits.find(commit => {
      return commit.branch.includes(props.currentBranch)
    })

    this._hashToIndex = new Map(props.commits.map((entry, i) => {
      return [entry.hash, i]
    }))

    this._visibleHashes = new Set(props.filteredCommits?.map(({ hash }) => {
      return hash
    }) ?? props.commits.map(({ hash }) => hash))

    this.ancestorFinder = new AncestorFinder({
      parents: props.parents,
      visibleHashes: this._visibleHashes
    })
  }


  public build() {
    if (this._headCommit) {
      this._activeNodes.enqueue([
        this._hashToIndex.get(this._headCommit.hash)!,
        'index'
      ])
    }

    for (const commit of this._commits) {
      let columnIndex = -1
      const commitHash = commit.hash

      const childHashes = this._children.get(commitHash) ?? []
      const branchChildren = this.getBranchChildren(commit)
      const mergeChildren = this.getMergeChildren(commit)

      const highestChild = this.findHighestChild(mergeChildren)
      const invalidIndices = highestChild ? this._activeNodes.get(highestChild) : new Set<number>()

      const { commitToReplaceHash, commitToReplaceColumn } = this.findCommitToReplace(
        commitHash,
        branchChildren,
        invalidIndices
      )

      if (commitToReplaceHash) {
        columnIndex = commitToReplaceColumn
        this._activeBranches.setHash(columnIndex, commitHash)
      } else if (childHashes.length > 0) {
        const childHash = childHashes[0]
        const childColumn = this._positions.get(childHash)?.[1] ?? 0
        columnIndex = this._activeBranches.insertCommit(commitHash, childColumn, invalidIndices)
      } else {
        columnIndex = this._activeBranches.insertCommit(commitHash, 0, new Set())
      }

      this._activeNodes.removeOutdatedNodes(this.rowIndex)
      const columnsToAdd = [columnIndex, ...branchChildren.map(child => {
        return this._positions.get(child)?.[1] ?? 0
      })]
      this._activeNodes.update(columnsToAdd)
      this._activeNodes.initialiseNewColumn(commitHash)

      const parentIndices = commit.parents.map(parent => {
        return this._hashToIndex.get(parent)
      }).filter(i => i !== undefined)

      const highestParentIndex: [number, string] = [Math.max(...parentIndices), commitHash]
      this._activeNodes.enqueue(highestParentIndex)

      branchChildren.forEach(child => {
        if (child !== commitToReplaceHash) {
          const pos = this._positions.get(child)
          if (pos) {
            this._activeBranches.removeHash(pos[1])
          }
        }
      })

      if (commit.parents.length === 0) {
        this._activeBranches.removeHash(columnIndex)
      }

      this._positions.set(commitHash, [this.rowIndex, columnIndex])
      this.rowIndex++
    }

    const { edges, rowMap } = this.findEdges()

    return {
      positions: rowMap,
      graphWidth: this._activeBranches.length,
      edges
    }
  }

  private findEdges() {
    const filteredHashes = this._filteredCommits
      ?.map(({ hash }) => hash)
      ?? this._commits.map(({ hash }) => hash)

    const filteredRows = [...filteredHashes]
      .map(hash => [hash, this._positions.get(hash)] as const)
      .filter(([, pos]) => !!pos) as [string, CommitNodeLocation][]

    const rowMap = new Map(
      filteredRows.map(([hash, [, col]], i) => {
        return [hash, [i + 1, col] as CommitNodeLocation]
      })
    )

    const filteredEdges = this._filteredCommits ?? this._commits

    const edges = filteredEdges.flatMap(source => {
      const output: GraphEdge[] = []

      for (const parentHash of source.parents) {
        const fromPos = rowMap.get(source.hash)
        const toHash = this._visibleHashes.has(parentHash)
          ? parentHash
          : this.ancestorFinder.findClosestVisibleAncestor(parentHash)

        const toPos = toHash ? rowMap.get(toHash) : undefined

        if (fromPos && toPos) {
          output.push({
            from: fromPos,
            to: toPos,
            rerouted: toHash !== parentHash,
            type: source.parents.length > 1 ? EdgeType.Merge : EdgeType.Normal
          })
        }
      }

      return output
    })

    return {
      edges,
      rowMap
    }
  }

  private getBranchChildren(commit: Commit) {
    const childHashes = this._children.get(commit.hash) ?? []
    return childHashes.filter(childHash => {
      return this._parents.get(childHash)?.[0] === commit.hash
    })
  }

  private getMergeChildren(commit: Commit) {
    const childHashes = this._children.get(commit.hash) ?? []
    return childHashes.filter(childHash => {
      return this._parents.get(childHash)?.[0] !== commit.hash
    })
  }

  private findHighestChild(mergeChildren: string[]) {
    let highestChild: string | undefined

    let iMin = Infinity

    for (const childSha of mergeChildren) {
      const iChild = this._positions.get(childSha)?.[0] ?? Infinity
      if (iChild < iMin) {
        iMin = this.rowIndex
        highestChild = childSha
      }
    }

    return highestChild
  }

  private findCommitToReplace(hash: string, branchChildren: string[], invalidIndices: Set<number>) {
    let commitToReplaceHash: string | null = null
    let commitToReplaceColumn = Infinity

    if (hash === this._headCommit?.hash) {
      commitToReplaceHash = 'index'
      commitToReplaceColumn = 0
    } else {
      for (const childHash of branchChildren) {
        const childColumn = this._positions.get(childHash)?.[1] ?? Infinity
        if (!invalidIndices.has(childColumn) && childColumn < commitToReplaceColumn) {
          commitToReplaceHash = childHash
          commitToReplaceColumn = childColumn
        }
      }
    }

    return {
      commitToReplaceHash,
      commitToReplaceColumn
    }
  }
}

interface CacheProps {
  parents: Map<string, string[]>
  visibleHashes: Set<string>
}

class AncestorFinder {
  private readonly cache = new Map<string, string | undefined>()

  private readonly _parents: Map<string, string[]>
  private readonly _visibleHashes: Set<string>

  constructor(props: CacheProps) {
    this._parents = props.parents
    this._visibleHashes = props.visibleHashes
  }

  public findClosestVisibleAncestor(hash: string) {
    return this.dfs(hash)
  }

  private dfs(hash: string): string | undefined {
    if (this.cache.has(hash)) {
      return this.cache.get(hash)
    }

    const parentHashes = this._parents.get(hash)

    if (!parentHashes || parentHashes.length === 0) {
      this.cache.set(hash, undefined)
      return undefined
    }

    for (const parentHash of parentHashes) {
      if (this._visibleHashes.has(parentHash)) {
        this.cache.set(hash, parentHash)
        return parentHash
      }
    }

    for (const parentHash of parentHashes) {
      const ancestor = this.dfs(parentHash)

      if (ancestor) {
        this.cache.set(hash, ancestor)
        return ancestor
      }
    }

    this.cache.set(hash, undefined)

    return undefined
  }
}