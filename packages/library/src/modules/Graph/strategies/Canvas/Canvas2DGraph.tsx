import { useGitContext } from 'context/GitContext'
import { useGraphContext } from 'modules/Graph/context'
import { useCallback, useEffect, useRef } from 'react'
import { ROW_HEIGHT } from 'constants/constants'
import { useTheme } from 'hooks/useTheme'
import { CanvasRenderer } from 'modules/Graph/strategies/Canvas/CanvasRenderer'

export const Canvas2DGraph = () => {
  const { getCommitNodeColours, getGraphColumnColour } = useTheme()
  const { graphWidth, visibleCommits, nodeSize, nodeTheme } = useGraphContext()
  const { isIndexVisible, rowSpacing, paging, graphData, headCommit } = useGitContext()

  const getNodeColours = useCallback((columnIndex: number) => {
    return getCommitNodeColours({
      columnColour: getGraphColumnColour(columnIndex)
    })
  }, [getCommitNodeColours, getGraphColumnColour])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasWidth = (4 + nodeSize) * graphWidth
  const canvasHeight = (ROW_HEIGHT + rowSpacing) * (visibleCommits.length + (isIndexVisible ? 1 : 0))

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

    const canvasRenderer = new CanvasRenderer({
      ctx,
      nodeSize,
      graphData,
      nodeTheme,
      rowSpacing,
      canvasHeight,
      isIndexVisible,
      colours: getNodeColours,
      commits: visibleCommits
    })

    if (isIndexVisible && headCommit) {
      const headCommitLocation = graphData.positions.get(headCommit.hash)!
      canvasRenderer.drawGitIndex(headCommitLocation)
    }

    canvasRenderer.draw()
  }, [canvasHeight, canvasWidth, getCommitNodeColours, graphData, paging, rowSpacing, visibleCommits, nodeSize, getNodeColours, isIndexVisible, headCommit])
  
  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  )
}