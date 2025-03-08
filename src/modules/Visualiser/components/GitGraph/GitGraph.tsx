import { GitGraphProps } from './types.ts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buildGraph } from 'modules/Visualiser/utils/buildGraph'
import styles from './GitGraph.module.scss'
import { CommitNode } from 'modules/Visualiser/components/CommitNode'
import { BranchLine } from 'modules/Visualiser/components/BranchLine'
import { MergeLine } from 'modules/Visualiser/components/MergeLine'
import { Commit, ROW_HEIGHT } from 'modules/Visualiser'
import { GitLog } from 'modules/Visualiser/components/GitLog'
import { useMouse } from '@uidotdev/usehooks'
import { BranchesTags } from 'modules/Visualiser/components/BranchesTags'

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

/**
 * Number of pixels to offset the top of the
 * table so that the rows line up with the
 * commit nodes in the graph.
 */
const TABLE_TOP_OFFSET = 8

export const GitGraph = ({
  entries,
  showBranchesTags = false,
  showGitLog = true,
  padding = {
    top: TOP_OFFSET,
    left: LEFT_OFFSET
  }
}: GitGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(400)

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

  const [mouse] = useMouse()
  const [dragging, setDragging] = useState(false)
  const graphContainerRef = useRef<HTMLDivElement>(null)
  const [graphWidth, setGraphWidth] = useState<number>(400)

  useEffect(() => {
    if (graphContainerRef.current && dragging) {
      const containerLeft = graphContainerRef.current.getBoundingClientRect().x
      const containerWidth = graphContainerRef.current.getBoundingClientRect().width
      const containerRight = containerLeft + containerWidth
      const newWidth = containerWidth + (mouse.x - containerRight)

      if (newWidth < 800 && newWidth > 200) {
        setGraphWidth(newWidth)
      }
    }
  }, [dragging, mouse.x])

  useEffect(() => {
    const stopDragging = () => {
      setDragging(false)
    }

    window.addEventListener('mouseup', stopDragging)

    return () => {
      window.removeEventListener('mouseup', stopDragging)
    }
  }, [])

  const [selected, setSelected] = useState<Commit>()

  const { commits } = useMemo(() => {
    return buildGraph(entries, ROW_HEIGHT)
  }, [entries, ROW_HEIGHT])

  console.log('positionedCommits', commits)

  const uniqueXValues = [...new Set(commits.map((c) => c.x))].length
  const nodeSpacingX = containerWidth / Math.max(uniqueXValues, 1) // Prevent division by zero

  console.log('nodeSpacingX', nodeSpacingX)
  console.log('Unique Xs', new Set(commits.map((c) => c.x)))
  console.log('Unique Branches', new Set(commits.map((c) => c.branch)))

  const colours: Record<number, string> = {
    0: 'red',
    1: 'green',
    2: 'blue',
    3: 'yellow',
    4: 'orange',
    5: 'pink',
    6: 'purple'
  }

  console.log('branchTips', commits.filter(it => it.isBranchTip))
  console.log('selectedCommit', selected)

  return (
    <div ref={containerRef} className={styles.container}>
      {showBranchesTags && (
        <div className={styles.tags}>
          <BranchesTags commits={commits} />
        </div>
      )}

      <div className={styles.graph} style={{ width: graphWidth }} ref={graphContainerRef}>
        {commits.flatMap((commit) =>
          commit.parents.map((parentHash, index) => {
            const parent = commits.find(({ hash }) => hash === parentHash)

            if (!parent) {
              return null
            }

            const isMergeCommit = commit.parents.length > 1 && index > 0

            if (isMergeCommit) {
              return (
                <MergeLine
                  yEnd={parent.y + 18}
                  yStart={commit.y + 25}
                  id={`${commit.hash}-${parentHash}`}
                  xEnd={parent.x * nodeSpacingX + 30}
                  xStart={commit.x * nodeSpacingX + 12}
                />
              )
            }

            return (
              <BranchLine
                id={`${commit.hash}-${parentHash}`}
                color={colours[commit.x] ?? 'black'}
                height={Math.abs(commit.y - parent.y)}
                x={Math.min(commit.x, parent.x) * nodeSpacingX + LEFT_OFFSET}
                y={Math.min(commit.y, parent.y) + (ROW_HEIGHT / 2) + TOP_OFFSET - 15}
              />
            )
          })
        )}

        {commits.map((commit) => (
          <CommitNode
            commit={commit}
            hash={commit.hash}
            onClick={setSelected}
            parents={commit.parents}
            y={commit.y + TOP_OFFSET}
            color={colours[commit.x] ?? 'black'}
            x={commit.x * nodeSpacingX + LEFT_OFFSET}
          />
        ))}

        {selected && (
          <div
            className={styles.selected}
            style={{
              height: 40,
              top: selected.y + TOP_OFFSET - 20,
              width: `calc(100% - ${(selected.x * nodeSpacingX) + 8}px)`
            }}
          />
        )}

        <div
          className={styles.dragHandle}
          onMouseDown={() => setDragging(true)}
        />
      </div>

      {showGitLog && (
        <div className={styles.log} style={{ marginTop: TABLE_TOP_OFFSET }}>
          <GitLog
            data={commits}
            selected={selected?.hash}
            onSelect={setSelected}
          />
        </div>
      )}
    </div>
  )
}