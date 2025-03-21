import { useMemo } from 'react'
import { columns, placeholderCommits } from './data'
import { PlaceholderData } from './types'

export const usePlaceholderData = (): PlaceholderData => {
  const placeholderData = useMemo(() => {
    return placeholderCommits.map((commit, i) => ({
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