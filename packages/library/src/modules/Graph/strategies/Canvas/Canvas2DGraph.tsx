import { useGitContext } from 'context/GitContext'
import { useGraphContext } from 'modules/Graph/context'
import { useEffect, useRef } from 'react'
import { ROW_HEIGHT } from 'constants/constants'
import { draw } from 'modules/Graph/strategies/Canvas/draw'
import { useTheme } from 'hooks/useTheme'

export const Canvas2DGraph = () => {
  const { isIndexVisible, rowSpacing, paging, graphData } = useGitContext()
  const { graphWidth, visibleCommits, nodeSize } = useGraphContext()
  const { getGraphColumnColour } = useTheme()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasWidth = (4 + nodeSize) * graphWidth
  const canvasHeight = (ROW_HEIGHT + rowSpacing) * visibleCommits.length

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    draw({
      ctx,
      rowSpacing,
      paging,
      graphData,
      nodeSize,
      getGraphColumnColour,
      commits: visibleCommits
    })
  }, [canvasHeight, canvasWidth, getGraphColumnColour, graphData, paging, rowSpacing, visibleCommits, nodeSize])
  
  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  )
}