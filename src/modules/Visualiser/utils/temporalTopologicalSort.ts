import { GitLogEntry } from 'modules/Visualiser'

export const temporalTopologicalSort = (entries: GitLogEntry[]) => {
  const seen = new Map<string, boolean>()

  const sorted: GitLogEntry[] = []

  const depthFirstSearch = (entry: GitLogEntry) => {
    if (seen.has(entry.hash)) {
      return
    }

    seen.set(entry.hash, true)

    entry.parents.forEach((parent) => {
      depthFirstSearch(entries.find(it => it.hash === parent)!)
    })

    sorted.push(entry)
  }

  const commitsSortedByTime = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  console.log('commitsSortedByTime', commitsSortedByTime)
  commitsSortedByTime.forEach(entry => {
    depthFirstSearch(entry)
  })

  return sorted
}