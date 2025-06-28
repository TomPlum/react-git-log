import { Commit } from 'types/Commit'
import { GitLogEntry } from 'types/GitLogEntry'

export const computeRelationships = <T>(
  entries: GitLogEntry<T>[],
  headCommitHash?: string
) => {
  const children = new Map<string, string[]>()
  const parents = new Map<string, string[]>()
  const hashToEntry = new Map<string, GitLogEntry<T>>()

  entries.forEach(entry => {
    children.set(entry.hash, [])
    hashToEntry.set(entry.hash, entry)
  })

  entries.forEach(entry => {
    const hash = entry.hash
    const parentHashes = entry.parents
    parents.set(hash, parentHashes)

    parentHashes.forEach(parentHash => {
      const currentChildren = children.get(parentHash)
      if (currentChildren) {
        currentChildren.push(hash)
      }
    })
  })

  const hashToCommit = new Map<string, Commit<T>>()

  for (const [hash, entry] of hashToEntry) {
    hashToCommit.set(hash, {
      ...entry,
      children: children.get(hash) ?? [],
      isBranchTip: headCommitHash
        ? hash === headCommitHash
        : (children.get(hash)?.length ?? 0) === 0
    } as Commit<T>)
  }

  return { parents, children, hashToCommit }
}