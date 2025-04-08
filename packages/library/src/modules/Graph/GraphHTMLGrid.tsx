import { GraphCore } from 'modules/Graph/core'
import { HTMLGridGraph } from 'modules/Graph/strategies/Grid'
import { HTMLGridGraphProps } from './types'

export const GraphHTMLGrid = (props: HTMLGridGraphProps) => {
  return (
    <GraphCore {...props}>
      <HTMLGridGraph />
    </GraphCore>
  )
}