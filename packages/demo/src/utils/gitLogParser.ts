import { GitLogEntry } from '@tomplum/react-git-log'

export const parseGitLogOutput = (output: string): GitLogEntry[] => {
  const commits = output.trim().split('\n')
  const logRegex = /^hash:(\S+),parents:(.*?),branch:(\S*),refs:(.*?),msg:(.+),cdate:([\d\- :+]+),adate:([\d\- :+]+)/

  return commits.map(commit => {
    const match = commit.trim().match(logRegex)

    if (match) {
      return {
        hash: match[1],
        parents: match[2] ? match[2].split(' ') : [],
        branch: match[3].trim(),
        message: match[5],
        committerDate: match[6].trim(),
        authorDate: match[7].trim(),
      }
    }

    return null
  }).filter(it => it != null)
}