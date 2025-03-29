import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

const keysToIgnore: (keyof GraphColumnState)[] = [
  'isFirstRow',
  'isLastRow'
]

export const isColumnEmpty = (state: GraphColumnState): boolean => {
  return Object.entries(state)
    .filter(([key]) => !keysToIgnore.includes(key as keyof GraphColumnState))
    .every(([,value]) => !value)
}