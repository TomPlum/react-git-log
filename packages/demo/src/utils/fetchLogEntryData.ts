import dayjs from 'dayjs'
import { parseGitLogOutput } from './gitLogParser'
import { GitLogEntry } from '@tomplum/react-git-log'

const fetchEntries = async (name: string): Promise<GitLogEntry[]> => {
  const response = await fetch(`/${name.split('/')[1]}.txt`)
  return parseGitLogOutput(await response.text())
}


export  const fetchLogEntryData = async (repository: string) => {
  const data = await fetchEntries(repository)
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