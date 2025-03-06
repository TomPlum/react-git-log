import { GitLogEntry } from 'modules/Visualiser'

export const buildGraph = (commits: GitLogEntry[], rowHeight: number) => {
  const branchMap = new Map<string, number>() // Maps commit hash -> x position
  const activeBranches: Map<string, number> = new Map() // Maps parent hash -> x slot
  let nextBranchIndex = 0

  return commits.map((commit, index) => {
    let x: number

    if (commit.parents.length === 0) {
      // Root commit (first commit in history)
      x = 0
    } else {
      // Try to inherit x-position from the first parent
      const firstParent = commit.parents[0]
      if (branchMap.has(firstParent)) {
        x = branchMap.get(firstParent)!
      } else {
        // Find an available branch slot
        x = [...activeBranches.values()].sort()[0] ?? nextBranchIndex++
      }
    }

    // Assign x position
    branchMap.set(commit.hash, x)
    activeBranches.set(commit.hash, x)

    // Handle merges
    if (commit.parents.length > 1) {
      commit.parents.forEach((parent, i) => {
        if (i > 0 && branchMap.has(parent)) {
          // If this is a merge parent, free up its x slot
          activeBranches.delete(parent)
        }
      })
    }

    return {
      ...commit,
      x,
      y: index * rowHeight,
    }
  })
}