import { GraphColumnState } from 'modules/Graph/strategies/Grid/components/GraphColumn'

export const getEmptyColumnState = ({ columns }: { columns: number }) => {
  return new Array<GraphColumnState>(columns).fill({})
}