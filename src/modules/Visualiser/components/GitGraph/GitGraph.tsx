import { GRAPH_LEFT_OFFSET, GRAPH_TOP_OFFSET, TABLE_TOP_OFFSET } from './types.ts'
import styles from './GitGraph.module.scss'
import { CommitNode } from 'modules/Visualiser/components/CommitNode'
import { BranchLine } from 'modules/Visualiser/components/BranchLine'
import { MergeLine } from 'modules/Visualiser/components/MergeLine'
import { ROW_HEIGHT } from 'modules/Visualiser'
import { GitLog } from 'modules/Visualiser/components/GitLog'
import { BranchesTags } from 'modules/Visualiser/components/BranchesTags'
import { useResize } from 'modules/Visualiser/hooks/useResize'
import { useGitContext } from 'modules/Visualiser/context'
import classNames from 'classnames'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { FadingDiv } from 'components/FadingDiv'

export const GitGraph = () => {
  const {
    classes,
    commits,
    showGitLog,
    selectedCommit,
    previewedCommit,
    showBranchesTags,
    showTableHeaders,
    showCommitNodeHashes
  } = useGitContext()

  const { hoverColour, textColour, getCommitColour } = useTheme()

  const { width, ref, startResizing } = useResize()

  const uniqueXValues = [...new Set(commits.map((c) => c.x))].length
  const nodeSpacingX = width / Math.max(uniqueXValues, 1)

  return (
    <div
      style={classes?.containerStyles}
      className={classNames(styles.container, classes?.containerClass)}
    >
      {showBranchesTags && (
        <div className={styles.tags}>
          {showTableHeaders && (
            <h4 style={{ color: textColour, marginLeft: 10 }} className={styles.title}>
              Branch / Tag
            </h4>
          )}

          <BranchesTags
            commits={commits}
            commitNodeSpacing={nodeSpacingX}
          />
        </div>
      )}

      <div className={styles.graphContainer} style={{ width }} ref={ref}>
        {showTableHeaders && (
          <h4 style={{ color: textColour }} className={styles.title}>
            Graph
          </h4>
        )}

        <div className={styles.graph}>
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
                    colour={getCommitColour(commit)}
                    id={`${commit.hash}-${parentHash}`}
                    key={`${commit.hash}-${parentHash}`}
                    xEnd={parent.x * nodeSpacingX + 30}
                    xStart={commit.x * nodeSpacingX + 12}
                  />
                )
              }

              return (
                <BranchLine
                  color={getCommitColour(commit)}
                  id={`${commit.hash}-${parentHash}`}
                  key={`${commit.hash}-${parentHash}`}
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
              key={commit.hash}
              hash={commit.hash}
              parents={commit.parents}
              y={commit.y + GRAPH_TOP_OFFSET}
              showCommitNodeHashes={showCommitNodeHashes}
              x={commit.x * nodeSpacingX + GRAPH_LEFT_OFFSET}
            />
          ))}

          {selectedCommit && (
            <div
              className={styles.selected}
              style={{
                height: 40,
                background: getCommitColour(selectedCommit),
                top: selectedCommit.y + GRAPH_TOP_OFFSET - 20,
                width: `calc(100% - ${(selectedCommit.x * nodeSpacingX) + 8}px)`
              }}
            />
          )}

          {previewedCommit && selectedCommit?.hash != previewedCommit.hash && (
            <FadingDiv
              className={styles.hovered}
              style={{
                height: 40,
                background: hoverColour,
                top: previewedCommit.y + GRAPH_TOP_OFFSET - 20,
                width: `calc(100% - ${(previewedCommit.x * nodeSpacingX) + 8}px)`
              }}
            />
          )}

          <div
            onMouseDown={startResizing}
            className={styles.dragHandle}
          />
        </div>
      </div>

      {showGitLog && (
        <div className={styles.log} style={{ marginTop: TABLE_TOP_OFFSET }}>
          <GitLog data={commits} />
        </div>
      )}
    </div>
  )
}