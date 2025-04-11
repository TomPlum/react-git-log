import { GraphCore } from 'modules/Graph/core'
import { Canvas2DGraph } from 'modules/Graph/strategies/Canvas'
import { Canvas2DGraphProps } from './types'

export const GraphCanvas2D = (props: Canvas2DGraphProps) => {
  return (
    <GraphCore {...props}>
      <Canvas2DGraph />
    </GraphCore>
  )
}