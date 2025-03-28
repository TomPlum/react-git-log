import { Commit } from 'types/Commit'
import { GitLogEntry } from 'types/GitLogEntry'

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
      committerDate: entry.committerDate,
      authorDate: entry.authorDate,
      message: entry.message,
      parents: entry.parents,
      branch: entry.branch,
      author: entry.author
    })
  })

  // Use parent hashes to calculate children.
  // I.e. find the inverse relationship.
  entries.forEach((entry) => {
    const hash = entry.hash
    const parentHashes = entry.parents
    parents.set(hash, parentHashes)

    parentHashes.forEach(parentHash => {
      const currentChildren = children.get(parentHash)

      // If we have a children entry for the current parent hash,
      // then map this entries commit has to it.
      // The only time we won't have a children mapped is if the log has
      // been passed an incomplete set of entry data (like via
      // server-side pagination) and so the parent hash does not
      // exist in the hash -> children array map.
      if (currentChildren) {
        currentChildren.push(hash)
      }
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