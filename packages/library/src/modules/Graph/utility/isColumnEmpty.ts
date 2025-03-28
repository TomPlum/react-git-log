import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export const isColumnEmpty = (state: GraphColumnState): boolean => {
  return Object.values(state).every(value => !value)
}