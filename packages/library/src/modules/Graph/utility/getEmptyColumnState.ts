import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export const getEmptyColumnState = ({ columns }: { columns: number }) => {
  return new Array<GraphColumnState>(columns).fill({})
}