import { Commit } from 'modules/Visualiser'

export const temporalTopologicalSort = (
  commits: Commit[],
  children: Map<string, string[]>,
  hashToCommit: Map<string, Commit>
) => {
  const sorted: Commit[] = []
  const seen = new Map<string, boolean>()

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