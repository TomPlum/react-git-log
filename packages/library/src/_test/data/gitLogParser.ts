import { GitLogEntry } from 'types'

export const parseGitLogOutput = (output: string): GitLogEntry[] => {
  const commits = output.trim().split('\n')
  const logRegex =
    /^hash:(?<hash>\S+),parents:(?<parents>.*?),branch:(?<branch>\S*),msg:(?<message>.+),cdate:(?<committerDate>[\d\- :+]+),adate:(?<authorDate>[\d\- :+]+)/

  if (output.length === 0) {
    return []
  }

  return commits
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

      throw Error(`Invalid commit entry data: ${commit}`)
    })
}