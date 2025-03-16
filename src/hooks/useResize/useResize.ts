import { useCallback, useEffect, useRef, useState } from 'react'
import { useMouse } from '@uidotdev/usehooks'
import { ResizeState } from './types.ts'
import { useGitContext } from 'context'

export const useResize = (): ResizeState => {
  const [mouse] = useMouse()
  const [dragging, setDragging] = useState(false)
  const graphContainerRef = useRef<HTMLDivElement>(null)

  const { graphContainerWidth, setGraphContainerWidth } = useGitContext()

  useEffect(() => {
    if (graphContainerRef.current && dragging) {
      const containerLeft = graphContainerRef.current.getBoundingClientRect().x
      const containerWidth = graphContainerRef.current.getBoundingClientRect().width
      const containerRight = containerLeft + containerWidth
      const newWidth = containerWidth + (mouse.x - containerRight)

      if (newWidth < 800 && newWidth > 200) {
        setGraphContainerWidth(newWidth)
      }
    }
  }, [dragging, mouse.x, setGraphContainerWidth])

  useEffect(() => {
    const stopDragging = () => {
      setDragging(false)
    }

    window.addEventListener('mouseup', stopDragging)

    return () => {
      window.removeEventListener('mouseup', stopDragging)
    }
  }, [])

  const startResizing = useCallback(() => {
    setDragging(true)
  }, [])

  return {
    width: graphContainerWidth,
    ref: graphContainerRef,
    startResizing
  }
}