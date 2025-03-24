import { GitLogEntry } from '@tomplum/react-git-log'

export const parseGitLogOutput = (output: string): GitLogEntry[] => {
  const commits = output.trim().split('\n')
  const logRegex =
    /^hash:(?<hash>\S+),parents:(?<parents>.*?),branch:(?<branch>\S*),msg:(?<message>.+),cdate:(?<committerDate>[\d\- :+]+),adate:(?<authorDate>[\d\- :+]+),author:(?<author>.+),email:(?<email>.+)/

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
          author:
            match.groups.author || match.groups.email
              ? {
                name: match.groups.author?.trim() || undefined,
                email: match.groups.email?.trim() || undefined,
              }
              : undefined
        }
      }

      return null
    })
    .filter((it): it is GitLogEntry => it !== null)
}