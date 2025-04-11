import { useGitContext } from 'context/GitContext'
import { useGraphContext } from 'modules/Graph/context'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ROW_HEIGHT } from 'constants/constants'
import { useTheme } from 'hooks/useTheme'
import { CanvasRenderer } from 'modules/Graph/strategies/Canvas/CanvasRenderer'
import { useSelectCommit } from 'hooks/useSelectCommit'
import styles from './Canvas2DGraph.module.scss'
import { MousePosition } from 'modules/Graph/strategies/Canvas/types'

export const Canvas2DGraph = () => {
  const [hoverPosition, setHoverPosition] = useState<MousePosition>()
  const [clickPosition, setClickPosition] = useState<MousePosition>()

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
    const canvasRenderer = rendererRef.current
    if (!hoverPosition || !canvasRenderer) return

    const commit = canvasRenderer.getCommitAtPosition(hoverPosition)

    if (commit && previewedCommit?.hash !== commit.hash && selectedCommit?.hash !== commit.hash) {
      selectCommitHandler.onMouseOver(commit)
    }
  }, [hoverPosition, previewedCommit?.hash, selectedCommit?.hash, selectCommitHandler])

  useEffect(() => {
    const canvasRenderer = rendererRef.current
    if (!clickPosition || !canvasRenderer) return

    const commit = canvasRenderer.getCommitAtPosition(clickPosition)
    if (commit) {
      selectCommitHandler.onClick(commit)
    }

    setClickPosition(undefined)
  }, [clickPosition, selectCommitHandler])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setHoverPosition({ x, y })
    }

    const handleMouseOut = () => {
      setHoverPosition(undefined)
      selectCommitHandler.onMouseOut()
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setClickPosition({ x, y })
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseout', handleMouseOut)
    canvas.addEventListener('click', handleClick)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseout', handleMouseOut)
      canvas.removeEventListener('click', handleClick)
    }
  }, [selectCommitHandler])

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className={styles.canvas}
    />
  )
}