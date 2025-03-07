import { GitGraphProps } from './types.ts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buildGraph } from 'modules/Visualiser/utils/buildGraph'
import styles from './GitGraph.module.scss'

export const GitGraph = ({ commits, showBranchesTags }: GitGraphProps) => {
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
          {entries.filter(it => it.isBranchTip).map((commit, i) => (
            <div key={`tag_${i}`} className={styles.tag} title={commit.branch}>
              {commit.branch.replace('refs/heads/', '').replace('refs/remotes/origin/', '')}
            </div>
          ))}
        </div>
      )}

      <div className={styles.graph}>
        {entries.flatMap((commit) =>
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
                  left: Math.min(commit.x, parent.x) * nodeSpacingX + 12,
                  top: Math.min(commit.y, parent.y) + rowHeight / 2,
                  height: Math.abs(commit.y - parent.y),
                }}
              />
            )
          })
        )}

        {entries.map((commit) => (
          <div
            key={commit.hash}
            className={styles.commitNode}
            style={{
              left: commit.x * nodeSpacingX,
              top: commit.y,
              backgroundColor: colours[commit.x] ?? 'black',
            }}
          >
            <span className={styles.commitLabel}>{commit.hash}</span>
          </div>
        ))}
      </div>
    </div>
  )
}