import { GitLogEntry } from '../types.ts'

export const parseGitLogOutput = (output: string): GitLogEntry[] => {
  const commits = output.split('\n')
  const logRegex = /^hash:(\S+),parents:(.*?),branch:(\S*),refs:(.*?),msg:(.+)/

  return commits.map(commit => {
    const match = commit.match(logRegex)

    if (match) {
      return {
        hash: match[1],
        parents: match[2] ? match[2].split(' ') : [],
        branch: match[3].trim(),
        refs: match[4].trim(),
        message: match[5]
      }
    }

    return null
  }).filter(it => it != null)
}