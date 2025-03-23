import { GitLogEntry } from 'types'

export const parseGitLogOutput = (output: string): GitLogEntry[] => {
  const commits = output.trim().split('\n')
  const logRegex =
    /^hash:(?<hash>\S+),parents:(?<parents>.*?),branch:(?<branch>\S*),msg:(?<message>.+),cdate:(?<committerDate>[\d\- :+]+),adate:(?<authorDate>[\d\- :+]+)/

  if (output.length === 0) {
    return []
  }

  const invalid: string[] = []

  const parsed = commits
    .map(commit => {
      const match = commit.trim().match(logRegex)

      if (match?.groups) {
        return {
          hash: match.groups.hash,
          parents: match.groups.parents ? match.groups.parents.split(' ') : [],
          branch: match.groups.branch.trim(),
          message: match.groups.message,
          committerDate: match.groups.committerDate.trim(),
          authorDate: match.groups.authorDate.trim(),
        }
      }

      invalid.push(commit)
    })

  if (invalid.length > 0) {
    console.warn(`There were ${invalid.length} invalid entries in the git log entry data.`)
    invalid.forEach(entry => console.warn(entry))
  }

  return parsed.filter(entry => !!entry)
}