import { GraphCore } from 'modules/Graph/core'
import { HTMLGridGraph } from 'modules/Graph/strategies/Grid'
import { HTMLGridGraphProps } from './types'

export const GraphHTMLGrid = <T,>(props: HTMLGridGraphProps<T>) => {
  return (
    <GraphCore<T> {...props}>
      <HTMLGridGraph />
    </GraphCore>
  )
}