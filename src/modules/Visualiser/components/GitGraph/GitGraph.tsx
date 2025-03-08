import { GitGraphProps } from './types.ts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buildGraph } from 'modules/Visualiser/utils/buildGraph'
import styles from './GitGraph.module.scss'
import { CommitNode } from 'modules/Visualiser/components/CommitNode'

/**
 * Number of pixels to offset all nodes and
 * lines by so that the graph starts a little
 * from the top of the container.
 */
const TOP_OFFSET = 30

/**
 * Number of pixels to offset all nodes and
 * lines by so that the graph starts a little
 * from the left of the container.
 */
const LEFT_OFFSET = 30

export const GitGraph = ({
  commits,
  showBranchesTags = false,
  padding = {
    top: TOP_OFFSET,
    left: LEFT_OFFSET
  }
}: GitGraphProps) => {
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

  console.log('branchTips', entries.filter(it => it.isBranchTip))

  return (
    <div ref={containerRef} className={styles.container}>
      {showBranchesTags && (
        <div className={styles.tags}>
          {entries.map((commit, i) => {
            if (commit.isBranchTip) {
              return (
                <div key={`tag_${i}`} className={styles.tag} title={commit.branch} style={{ height: rowHeight - 5 }}>
                  {commit.branch.replace('refs/heads/', '').replace('refs/remotes/origin/', '')}
                </div>
              )
            } else {
              return (
                <div
                  key={`empty_tag_${i}`}
                  className={styles.tag}
                  style={{ height: rowHeight - 5 }}
                />
              )
            }
          })}
        </div>
      )}

      <div className={styles.graph}>
        {entries.map((commit) =>
          commit.parents.map((parentHash) => {
            const parent = entries.find((c) => c.hash === parentHash)

            if (!parent) {
              return null
            }

            return (
              <div
                key={`${commit.hash}-${parentHash}`}
                className={styles.branchLine}
                style={{
                  left: Math.min(commit.x, parent.x) * nodeSpacingX + LEFT_OFFSET,
                  top: Math.min(commit.y, parent.y) + (rowHeight / 2) + TOP_OFFSET - 15,
                  height: Math.abs(commit.y - parent.y),
                  background: `rgba(${colours[commit.x] ?? 'black'}, 0.6)`
                }}
              />
            )
          })
        )}

        {entries.map((commit) => (
          <CommitNode
            hash={commit.hash}
            y={commit.y + TOP_OFFSET}
            color={colours[commit.x] ?? 'black'}
            x={commit.x * nodeSpacingX + LEFT_OFFSET}
          />
        ))}
      </div>
    </div>
  )
}