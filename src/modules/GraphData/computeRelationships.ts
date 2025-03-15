import { Commit, GitLogEntry } from 'modules/Visualiser'

type RawCommit = Omit<Commit, 'isBranchTip'>

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
    const commitSha = entry.hash
    const parentShas = entry.parents
    parents.set(commitSha, parentShas)

    parentShas.forEach(parentSha => {
      children.get(parentSha)!.push(commitSha)
    })
  })

  // Now that we've computed the relationships
  // we can decorate the raw commits with supplemental
  // information and build the final map of commits.
  const hashToCommit = new Map<string, Commit>()
  for (const [hash, rawCommit] of hashToRawCommit) {
    hashToCommit.set(hash, {
      ...rawCommit,
      isBranchTip: children.get(hash)?.length === 0
    })
  }

  return { parents, children, hashToCommit }
}