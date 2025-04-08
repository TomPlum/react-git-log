import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'

const keysToIgnore: (keyof GraphColumnState)[] = [
  'isFirstRow',
  'isLastRow'
]

export const isColumnEmpty = (state: GraphColumnState): boolean => {
  if (!state) {
    return true
  }

  return Object.entries(state)
    .filter(([key]) => !keysToIgnore.includes(key as keyof GraphColumnState))
    .every(([,value]) => !value)
}