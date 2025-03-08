import { GitGraphProps, GRAPH_LEFT_OFFSET, GRAPH_TOP_OFFSET, TABLE_TOP_OFFSET } from './types.ts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buildGraph } from 'modules/Visualiser/utils/buildGraph'
import styles from './GitGraph.module.scss'
import { CommitNode } from 'modules/Visualiser/components/CommitNode'
import { BranchLine } from 'modules/Visualiser/components/BranchLine'
import { MergeLine } from 'modules/Visualiser/components/MergeLine'
import { colours, Commit, ROW_HEIGHT } from 'modules/Visualiser'
import { GitLog } from 'modules/Visualiser/components/GitLog'
import { useMouse } from '@uidotdev/usehooks'
import { BranchesTags } from 'modules/Visualiser/components/BranchesTags'

export const GitGraph = ({
  entries,
  showBranchesTags = false,
  showGitLog = true,
  padding = {
    top: GRAPH_TOP_OFFSET,
    left: GRAPH_LEFT_OFFSET
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
  }, [entries])

  console.log('positionedCommits', commits)

  const uniqueXValues = [...new Set(commits.map((c) => c.x))].length
  const nodeSpacingX = containerWidth / Math.max(uniqueXValues, 1)

  console.log('nodeSpacingX', nodeSpacingX)
  console.log('Unique Xs', new Set(commits.map((c) => c.x)))
  console.log('Unique Branches', new Set(commits.map((c) => c.branch)))

  console.log('branchTips', commits.filter(it => it.isBranchTip))
  console.log('selectedCommit', selected)

  return (
    <div ref={containerRef} className={styles.container}>
      {showBranchesTags && (
        <div className={styles.tags}>
          <BranchesTags
            commits={commits}
            commitNodeSpacing={nodeSpacingX}
          />
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
                  colour={colours[commit.x]}
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
                x={Math.min(commit.x, parent.x) * nodeSpacingX + GRAPH_LEFT_OFFSET}
                y={Math.min(commit.y, parent.y) + (ROW_HEIGHT / 2) + GRAPH_TOP_OFFSET - 15}
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
            y={commit.y + GRAPH_TOP_OFFSET}
            color={colours[commit.x] ?? 'black'}
            x={commit.x * nodeSpacingX + GRAPH_LEFT_OFFSET}
          />
        ))}

        {selected && (
          <div
            className={styles.selected}
            style={{
              height: 40,
              top: selected.y + GRAPH_TOP_OFFSET - 20,
              background: colours[selected.x] ?? 'black',
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
            onSelect={setSelected}
            selected={selected?.hash}
            colour={selected ? colours[selected.x] ?? 'black' : undefined}
          />
        </div>
      )}
    </div>
  )
}