import dayjs from 'dayjs'
import { parseGitLogOutput } from './gitLogParser'
import { GitLogEntry } from '@tomplum/react-git-log'

const fetchEntries = async (name: string): Promise<GitLogEntry[]> => {
  const response = await fetch(`${import.meta.env.STORYBOOK_BASE}${name}`)
  const output = await response.text()
  return parseGitLogOutput(output)
}

export  const fetchLogEntryData = async (repository: string) => {
  const data: GitLogEntry[] = await fetchEntries(repository)

  const headCommit = data[0]
  const today = dayjs(new Date())
  const daysSinceHeadCommit = Math.abs(dayjs(headCommit.committerDate).diff(today, 'days'))

  if (daysSinceHeadCommit > 1) {
    const shiftedData: GitLogEntry[] = data.map(entry => ({
      ...entry,
      committerDate: dayjs(entry.committerDate).add(daysSinceHeadCommit, 'days').format()
    }))

    return shiftedData
  } else {
    return data
  }
}