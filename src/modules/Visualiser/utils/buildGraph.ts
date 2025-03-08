import { Commit, GitLogEntry } from 'modules/Visualiser'

export const buildGraph = (entries: GitLogEntry[], rowHeight: number) => {
  const branchMap = new Map<string, number>() // Maps commit hash -> x position
  const activeBranches = new Map<number, string>() // Maps x-position -> commit hash
  const branches = new Map<string, number>() // Branch Name -> ID
  let lastBranchId = 0

  let nextBranchIndex = 0

  const commits: Omit<Commit, 'isBranchTip'>[] = entries.map((entry, index) => {
    let x: number

    if (!branches.has(entry.branch)) {
      branches.set(entry.branch, lastBranchId)
      lastBranchId++
    }

    if (entry.parents.length === 0) {
      // Root commit (first commit in history)
      x = 0
    } else {
      const firstParent = entry.parents[0]
      if (branchMap.has(firstParent)) {
        // Inherit first parent's x position (fixes diagonal issue)
        x = branchMap.get(firstParent)!
      } else {
        // Assign a new branch slot
        x = nextBranchIndex++
      }
    }

    // Assign x position to commit
    branchMap.set(entry.hash, x)
    activeBranches.set(x, entry.hash)

    // Handle merges: free up x positions when branches merge back
    if (entry.parents.length > 1) {
      entry.parents.slice(1).forEach((parent) => {
        if (branchMap.has(parent)) {
          const parentX = branchMap.get(parent)!
          activeBranches.delete(parentX) // Free this x slot
        }
      })
    }

    return {
      ...entry,
      date: entry.date,
      x: branches.get(entry.branch)!,
      y: index * rowHeight,
    }
  })

  const commitsWithTips: Commit[] = commits.map(entry => {
    if (entries.find(it => it.parents.includes(entry.hash))) {
      return {
        ...entry,
        isBranchTip: false
      }
    }

    return {
      ...entry,
      isBranchTip: true
    }
  })

  return {
    commits: commitsWithTips
  }
}