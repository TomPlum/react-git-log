import { useGitContext } from 'context/GitContext'
import { useGraphContext } from 'modules/Graph/context'
import { useCallback, useEffect, useRef } from 'react'
import { ROW_HEIGHT } from 'constants/constants'
import { useTheme } from 'hooks/useTheme'
import { CanvasRenderer } from 'modules/Graph/strategies/Canvas/CanvasRenderer'
import { useSelectCommit } from 'hooks/useSelectCommit'
import styles from './Canvas2DGraph.module.scss'

export const Canvas2DGraph = () => {
  const { showTable } = useGitContext()
  const { selectCommitHandler } = useSelectCommit()
  const { getCommitNodeColours, getGraphColumnColour, hoverColour } = useTheme()
  const { graphWidth, visibleCommits, nodeSize, nodeTheme, orientation } = useGraphContext()

  const {
    graphData,
    rowSpacing,
    headCommit,
    isIndexVisible,
    selectedCommit,
    previewedCommit,
  } = useGitContext()

  const getNodeColours = useCallback((columnIndex: number) => {
    return getCommitNodeColours({
      columnColour: getGraphColumnColour(columnIndex)
    })
  }, [getCommitNodeColours, getGraphColumnColour])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<CanvasRenderer | null>(null)

  const canvasWidth = (4 + nodeSize) * graphWidth
  const canvasHeight = (ROW_HEIGHT + rowSpacing) * (visibleCommits.length + (isIndexVisible ? 1 : 0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

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
      showTable,
      rowSpacing,
      orientation,
      canvasWidth,
      canvasHeight,
      isIndexVisible,
      selectedCommit,
      previewedCommit,
      colours: getNodeColours,
      commits: visibleCommits,
      previewBackgroundColour: hoverColour
    })

    rendererRef.current = canvasRenderer

    if (isIndexVisible && headCommit) {
      const headCommitLocation = graphData.positions.get(headCommit.hash)!
      canvasRenderer.drawGitIndex(headCommitLocation)
    }

    canvasRenderer.draw()
  }, [
    canvasWidth,
    canvasHeight,
    nodeSize,
    graphData,
    nodeTheme,
    showTable,
    rowSpacing,
    orientation,
    isIndexVisible,
    selectedCommit,
    previewedCommit,
    getNodeColours,
    visibleCommits,
    hoverColour,
    headCommit
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!rendererRef.current) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const commit = rendererRef.current.getCommitAtPosition({ x, y })

      const hoveredIsNotPreviewed = previewedCommit?.hash !== commit?.hash
      const hoveredIsNotSelected = selectedCommit?.hash !== commit?.hash

      if (commit && hoveredIsNotPreviewed && hoveredIsNotSelected) {
        selectCommitHandler.onMouseOver(commit)
      }
    }

    const handleMouseOut = () => {
      selectCommitHandler.onMouseOut()
    }

    const handleClick = (e: MouseEvent) => {
      if (!rendererRef.current) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const commit = rendererRef.current.getCommitAtPosition({ x, y })

      if (commit) {
        selectCommitHandler.onClick(commit)
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseout', handleMouseOut)
    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseout', handleMouseOut)
      canvas.removeEventListener('click', handleClick)
    }
  }, [previewedCommit?.hash, selectCommitHandler, selectedCommit?.hash])

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className={styles.canvas}
    />
  )
}