import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { fetchLogEntryData } from '@utils/fetchLogEntryData'
import { GetLogEntriesProps } from './types'

export const useGitLogEntries = ({ fileName }: GetLogEntriesProps) => {
  const getEntries = useCallback(() => {
    return fetchLogEntryData(fileName)
  }, [fileName])

  return useQuery({
    queryFn: getEntries,
    queryKey: [fileName],
    gcTime: Infinity
  })
}