import styles from './BranchesTags.module.scss'
import { Commit, ROW_HEIGHT } from 'modules/Visualiser'
import { BranchTag } from './BranchTag'
import { useGitContext } from 'modules/Visualiser/context'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { useCallback, useMemo } from 'react'

/**
 * Accounts for the height of the
 * nodes on the graph.
 */
const HEIGHT_OFFSET = 5

/**
 * The amount of padding, in pixels,
 * used around the branches/tags container.
 */
const PADDING = 10

const prepareCommits = (commits: Commit[]) => {
  const tagsSeen = new Map<string, boolean>()

  return commits.map(commit => {
    const isTag = commit.branch.includes('tags/')
    const hasBeenRendered = tagsSeen.has(commit.branch)

    const shouldRenderTag = isTag && !hasBeenRendered
    if (shouldRenderTag) {
      tagsSeen.set(commit.branch, true)
    }

    return {
      ...commit,
      isMostRecentTagInstance: shouldRenderTag
    }
  })
}

export const BranchesTags = () => {
  const { getCommitColour } = useTheme()
  const { previewedCommit, selectedCommit, indexCommit, graphData } = useGitContext()

  const preparedCommits = useMemo(() => {
    const commitsWithIndex = [
      indexCommit,
      ...graphData.commits
    ]

    return prepareCommits(commitsWithIndex)
  }, [graphData.commits, indexCommit])

  const tagLineWidth = useCallback((commit: Commit) => {
    const graphContainerWidth = 400 // TODO: Source dynamically
    const columnWidth = graphContainerWidth / graphData.graphWidth

    if (commit.hash === 'index') {
      return columnWidth / 2
    }

    const columnIndex = graphData.positions.get(commit.hash)![1]

    return  (columnWidth * columnIndex) + (columnWidth / 2)
  }, [graphData.graphWidth, graphData.positions])

  return (
    <div className={styles.container} style={{ padding: PADDING }}>
      {preparedCommits.map((commit, i) => {
        const shouldPreviewBranch = previewedCommit && commit.hash === previewedCommit.hash
        const selectedIsNotTip = selectedCommit && commit.hash === selectedCommit.hash
        const isIndexCommit = commit.hash === indexCommit.hash

        const showRenderBranchTag = commit.isBranchTip
          || shouldPreviewBranch
          || selectedIsNotTip
          || commit.isMostRecentTagInstance
          || isIndexCommit

        if (showRenderBranchTag) {
          return (
            <BranchTag
              commit={commit}
              id={i.toString()}
              key={`tag_${commit.hash}`}
              color={getCommitColour(commit)}
              height={i === 0 ? (ROW_HEIGHT - HEIGHT_OFFSET) : ROW_HEIGHT}
              lineWidth={tagLineWidth(commit)}
              lineRight={-tagLineWidth(commit)}
            />
          )
        } else {
          return (
            <div
              className={styles.tag}
              key={`empty_tag_${commit.hash}`}
              style={{ height: ROW_HEIGHT }}
            />
          )
        }
      })}
    </div>
  )
}