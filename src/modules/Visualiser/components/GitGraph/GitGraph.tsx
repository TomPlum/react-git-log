import { GitGraphProps, GRAPH_LEFT_OFFSET, GRAPH_TOP_OFFSET, TABLE_TOP_OFFSET } from './types.ts'
import { useMemo, useState } from 'react'
import { buildGraph } from 'modules/Visualiser/utils/buildGraph'
import styles from './GitGraph.module.scss'
import { CommitNode } from 'modules/Visualiser/components/CommitNode'
import { BranchLine } from 'modules/Visualiser/components/BranchLine'
import { MergeLine } from 'modules/Visualiser/components/MergeLine'
import { colours, Commit, ROW_HEIGHT } from 'modules/Visualiser'
import { GitLog } from 'modules/Visualiser/components/GitLog'
import { BranchesTags } from 'modules/Visualiser/components/BranchesTags'
import { useResize } from 'modules/Visualiser/hooks/useResize'

export const GitGraph = ({
  entries,
  showBranchesTags = false,
  showGitLog = true,
  padding = {
    top: GRAPH_TOP_OFFSET,
    left: GRAPH_LEFT_OFFSET
  }
}: GitGraphProps) => {
  const { width, ref, startResizing } = useResize({ defaultWidth: 400 })

  const [selected, setSelected] = useState<Commit>()

  const { commits } = useMemo(() => {
    return buildGraph(entries, ROW_HEIGHT)
  }, [entries])

  const uniqueXValues = [...new Set(commits.map((c) => c.x))].length
  const nodeSpacingX = width / Math.max(uniqueXValues, 1)

  return (
    <div className={styles.container}>
      {showBranchesTags && (
        <div className={styles.tags}>
          <BranchesTags
            commits={commits}
            commitNodeSpacing={nodeSpacingX}
          />
        </div>
      )}

      <div className={styles.graph} style={{ width }} ref={ref}>
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
          onMouseDown={startResizing}
          className={styles.dragHandle}
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