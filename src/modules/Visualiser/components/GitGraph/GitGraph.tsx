import { GitGraphProps } from './types.ts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buildGraph } from 'modules/Visualiser/utils/buildGraph'

export const GitGraph = ({ commits }: GitGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(400) // Default width

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth)
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const rowHeight = 30
  const maxBranches = new Set<string>()

  const positionedCommits = useMemo(() => {
    return buildGraph(commits, rowHeight)
  }, [commits, rowHeight])

  console.log('positionedCommits', positionedCommits)

  const colWidth = containerWidth / Math.max(1, maxBranches.size)

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
      <svg width="100%" height={commits.length * rowHeight}>
        {positionedCommits.map((commit) =>
          commit.parents.map((parent) => {
            const parentNode = positionedCommits.find((c) => c.hash === parent)
            if (!parentNode) return null
            return (
              <line
                key={`${commit.hash}-${parent}`}
                x1={commit.x * colWidth + colWidth / 2}
                y1={commit.y + rowHeight / 2}
                x2={parentNode.x * colWidth + colWidth / 2}
                y2={parentNode.y + rowHeight / 2}
                stroke="black"
              />
            )
          })
        )}

        {positionedCommits.map((commit) => (
          <circle
            key={commit.hash}
            cx={commit.x * colWidth + colWidth / 2}
            cy={commit.y + rowHeight / 2}
            r={5}
            fill="black"
          />
        ))}
      </svg>
    </div>
  )
}