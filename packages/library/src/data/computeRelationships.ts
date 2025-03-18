import { Commit, GitLogEntry } from 'types'

type RawCommit = Omit<Commit, 'isBranchTip' | 'children'>

export const computeRelationships = (entries: GitLogEntry[]) => {
  const children = new Map<string, string[]>()
  const parents = new Map<string, string[]>()
  const hashToRawCommit = new Map<string, RawCommit>()

  entries.forEach(entry => {
    // Initialise all git log entries with no children
    children.set(entry.hash, [])

    hashToRawCommit.set(entry.hash, {
      hash: entry.hash,
      refs: entry.refs,
      committerDate: entry.committerDate,
      authorDate: entry.authorDate,
      message: entry.message,
      parents: entry.parents,
      branch: entry.branch,
    })
  })

  // Use parent hashes to calculate children.
  // I.e. find the inverse relationship.
  entries.forEach((entry) => {
    const hash = entry.hash
    const parentHashes = entry.parents
    parents.set(hash, parentHashes)

    parentHashes.forEach(parentHash => {
      children.get(parentHash)!.push(hash)
    })
  })

  // Now that we've computed the relationships
  // we can decorate the raw commits with supplemental
  // information and build the final map of commits.
  const hashToCommit = new Map<string, Commit>()
  for (const [hash, rawCommit] of hashToRawCommit) {
    hashToCommit.set(hash, {
      ...rawCommit,
      children: children.get(hash) ?? [],
      isBranchTip: children.get(hash)?.length === 0
    })
  }

  return { parents, children, hashToCommit }
}