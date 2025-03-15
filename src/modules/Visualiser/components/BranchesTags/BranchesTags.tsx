import styles from './BranchesTags.module.scss'
import { BranchesTagsProps } from './types'
import { Commit, ROW_HEIGHT } from 'modules/Visualiser'
import { BranchTag } from './BranchTag'
import { GRAPH_LEFT_OFFSET } from 'modules/Visualiser/components/GitGraph'
import { useGitContext } from 'modules/Visualiser/context'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { useMemo } from 'react'

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

export const BranchesTags = ({ commits, commitNodeSpacing }: BranchesTagsProps) => {
  const { getCommitColour } = useTheme()
  const { previewedCommit, selectedCommit, indexCommit } = useGitContext()

  const preparedCommits = useMemo(() => {

    const commitsWithIndex = [
      indexCommit,
      ...commits
    ]

    return prepareCommits(commitsWithIndex)
  }, [commits, indexCommit])

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
              lineWidth={(commit.x * commitNodeSpacing) + GRAPH_LEFT_OFFSET}
              lineRight={0 - PADDING - (commit.x * commitNodeSpacing) - GRAPH_LEFT_OFFSET + 10}
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