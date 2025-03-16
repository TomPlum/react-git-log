import { useMemo } from 'react'
import { columns, commits } from './data'
import { PlaceholderData } from './types'

export const usePlaceholderData = (): PlaceholderData => {
  const placeholderData = useMemo(() => {
    return commits.map((commit, i) => ({
      commit,
      columns: columns[i].map(col => ({
        ...col,
        isPlaceholderSkeleton: true
      }))
    }))
  }, [])

  return {
    placeholderData
  }
}