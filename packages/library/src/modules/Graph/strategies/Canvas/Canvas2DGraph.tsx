import { useGitContext } from 'context/GitContext'
import { useGraphContext } from 'modules/Graph/context'
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ROW_HEIGHT } from 'constants/constants'
import { useTheme } from 'hooks/useTheme'
import { CanvasRenderer } from 'modules/Graph/strategies/Canvas/CanvasRenderer'
import { useSelectCommit } from 'hooks/useSelectCommit'
import styles from './Canvas2DGraph.module.scss'

export const Canvas2DGraph = () => {
  const [xHover, setXHover] = useState<number>()
  const [yHover, setYHover] = useState<number>()

  const [xClick, setXClick] = useState<number>()
  const [yClick, setYClick] = useState<number>()

  const { selectCommitHandler } = useSelectCommit()
  const { getCommitNodeColours, getGraphColumnColour, hoverColour } = useTheme()
  const { graphWidth, visibleCommits, nodeSize, nodeTheme, orientation } = useGraphContext()

  const {
    paging,
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

    if (isIndexVisible && headCommit) {
      const headCommitLocation = graphData.positions.get(headCommit.hash)!
      canvasRenderer.drawGitIndex(headCommitLocation)
    }

    if (xHover && yHover) {
      const commit = canvasRenderer.getCommitAtPosition(xHover, yHover)

      if (commit && previewedCommit?.hash !== commit.hash) {
        selectCommitHandler.onMouseOver(commit)
      }
    }

    if (xClick && yClick) {
      const commit = canvasRenderer.getCommitAtPosition(xClick, yClick)

      if (commit) {
        selectCommitHandler.onClick(commit)
      }

      setXClick(undefined)
      setYClick(undefined)
    }

    canvasRenderer.draw()
  }, [canvasHeight, canvasWidth, getCommitNodeColours, graphData, paging, rowSpacing, visibleCommits, nodeSize, getNodeColours, isIndexVisible, headCommit, nodeTheme, orientation, xHover, yHover, hoverColour, selectCommitHandler, selectedCommit, previewedCommit, xClick, yClick])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setXHover(x)
      setYHover(y)
    }

    const handleMouseOut = () => {
      setXHover(undefined)
      setYHover(undefined)
      selectCommitHandler.onMouseOut()
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setXClick(x)
      setYClick(y)
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