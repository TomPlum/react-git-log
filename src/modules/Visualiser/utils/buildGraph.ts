import { GitLogEntry } from 'modules/Visualiser'

export const buildGraph = (commits: GitLogEntry[], rowHeight: number) => {
  const branchMap = new Map<string, number>() // Maps commit hash -> x position
  const maxBranches = new Set<string>()
  let nextBranchIndex = 0

  const entries = commits.map((commit, index) => {
    const branchIndex = branchMap.get(commit.hash) ?? nextBranchIndex
    if (!branchMap.has(commit.hash)) {
      branchMap.set(commit.hash, branchIndex)
      maxBranches.add(commit.hash)
      nextBranchIndex++
    }

    commit.parents.forEach((parent) => {
      if (!branchMap.has(parent)) {
        branchMap.set(parent, nextBranchIndex++)
        maxBranches.add(parent)
      }
    })

    return {
      ...commit,
      x: branchIndex,
      y: index * rowHeight,
    }
  })

  return {
    entries,
    maxBranches
  }
}