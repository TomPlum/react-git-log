import { GitLogEntry } from '../types.ts'

export const parseGitLogOutput = (output: string): GitLogEntry[] => {
  const commits = output.trim().split('\n')
  const logRegex = /^hash:(\S+),parents:(.*?),branch:(\S*),refs:(.*?),msg:(.+),date:([\d\- :+]+)/

  return commits.map(commit => {
    const match = commit.trim().match(logRegex)

    if (match) {
      return {
        hash: match[1],
        parents: match[2] ? match[2].split(' ') : [],
        branch: match[3].trim(),
        refs: match[4].trim(),
        message: match[5],
        date: match[6].trim(),
      }
    }

    return null
  }).filter(it => it != null)
}