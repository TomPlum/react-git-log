import { GitLogEntry } from 'modules/Visualiser'

export const buildGraph = (commits: GitLogEntry[], rowHeight: number) => {
  const branchMap = new Map<string, number>() // Maps commit hash -> x position
  const activeBranches = new Map<number, string>() // Maps x-position -> commit hash
  const branches = new Map<string, number>() // Branch Name -> ID
  let lastBranchId = 0

  let nextBranchIndex = 0

  const entries = commits.map((commit, index) => {
    let x: number

    if (!branches.has(commit.branch)) {
      branches.set(commit.branch, lastBranchId)
      lastBranchId++
    }

    if (commit.parents.length === 0) {
      // Root commit (first commit in history)
      x = 0
    } else {
      const firstParent = commit.parents[0]
      if (branchMap.has(firstParent)) {
        // Inherit first parent's x position (fixes diagonal issue)
        x = branchMap.get(firstParent)!
      } else {
        // Assign a new branch slot
        x = nextBranchIndex++
      }
    }

    // Assign x position to commit
    branchMap.set(commit.hash, x)
    activeBranches.set(x, commit.hash)

    // Handle merges: free up x positions when branches merge back
    if (commit.parents.length > 1) {
      commit.parents.slice(1).forEach((parent) => {
        if (branchMap.has(parent)) {
          const parentX = branchMap.get(parent)!
          activeBranches.delete(parentX) // Free this x slot
        }
      })
    }

    return {
      ...commit,
      x: branches.get(commit.branch)!,
      y: index * rowHeight,
    }
  })

  const entriesWithTips = entries.map(entry => {
    if (entries.find(it => it.parents.includes(entry.hash))) {
      return entry
    }

    return {
      ...entry,
      isBranchTip: true
    }
  })

  return {
    entries: entriesWithTips,
  }
}