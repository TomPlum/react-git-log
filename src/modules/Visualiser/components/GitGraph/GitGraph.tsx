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

  const rowHeight = 48

  const { entries } = useMemo(() => {
    return buildGraph(commits, rowHeight)
  }, [commits, rowHeight])

  console.log('positionedCommits', entries)

  const uniqueXValues = [...new Set(entries.map((c) => c.x))].length
  const nodeSpacingX = containerWidth / Math.max(uniqueXValues, 1) // Prevent division by zero
  console.log('nodeSpacingX', nodeSpacingX)
  console.log('Unique Xs', new Set(entries.map((c) => c.x)))
  console.log('Unique Branches', new Set(entries.map((c) => c.branch)))

  const colours: Record<number, string> = {
    0: 'red',
    1: 'green',
    2: 'blue',
    3: 'yellow',
    4: 'orange',
    5: 'pink',
    6: 'purple'
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
      <svg width="100%" height={commits.length * rowHeight} style={{ background: 'white', marginTop: 25 }}>
        {/** Render branch lines first to keep nodes on top */}
        {entries.flatMap((commit) =>
          commit.parents.map((parentHash) => {
            const parent = entries.find((c) => c.hash === parentHash)
            if (!parent) return null

            return (
              <line
                key={`${commit.hash}-${parentHash}`}
                x1={commit.x * 30}
                y1={commit.y}
                x2={parent.x * nodeSpacingX}
                y2={parent.y}
                stroke={colours[commit.x] ?? 'black'}
                strokeWidth="2"
              />
            )
          })
        )}

        {/** Render nodes on top */}
        {entries.map((commit) => (
          <circle
            key={commit.hash}
            cx={commit.x * 30}
            cy={commit.y}
            r={5}
            fill={colours[commit.x] ?? 'black'}
            stroke="black"
          />
        ))}
    </svg>
    </div>
  )
}