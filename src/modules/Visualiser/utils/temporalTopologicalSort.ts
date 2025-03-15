import { Commit } from 'modules/Visualiser'
import { computeRelationships } from 'modules/Visualiser/utils/computeNodeColumns'

export const temporalTopologicalSort = (commits: Commit[]) => {
  const sorted: Commit[] = []
  const seen = new Map<string, boolean>()

  // TODO: Do this just once instead of in here and in the computeNodeColumns.ts
  const { children, commits: hashToCommit } = computeRelationships(commits)

  const depthFirstSearch = (commit: Commit) => {
    if (seen.has(commit.hash)) {
      return
    }

    seen.set(commit.hash, true)

    children.get(commit.hash)!.forEach((childHash) => {
      depthFirstSearch(hashToCommit.get(childHash)!)
    })

    sorted.push(commit)
  }

  const commitsSortedByTime = commits.sort((a, b) => {
    return new Date(b.committerDate).getTime() - new Date(a.committerDate).getTime()
  })

  commitsSortedByTime.forEach(entry => {
    depthFirstSearch(entry)
  })

  return sorted
}