import styles from './BranchesTags.module.scss'
import { BranchesTagsProps } from './types'
import { ROW_HEIGHT } from 'modules/Visualiser'
import { BranchTag } from './BranchTag'
import { GRAPH_LEFT_OFFSET } from 'modules/Visualiser/components/GitGraph'
import { useGitContext } from 'modules/Visualiser/context'

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

export const BranchesTags = ({ commits, commitNodeSpacing }: BranchesTagsProps) => {
  const { colours, previewedCommit, selectedCommit } = useGitContext()

  return (
    <div className={styles.container} style={{ padding: PADDING }}>
      {commits.map((commit, i) => {
        const shouldPreviewBranch = previewedCommit && commit.hash === previewedCommit.hash
        const selectedIsNotTip = selectedCommit && commit.hash === selectedCommit.hash
        const isTag = commit.branch.includes('tags/')

        if (commit.isBranchTip || shouldPreviewBranch || selectedIsNotTip || isTag) {
          return (
            <BranchTag
              key={i}
              commit={commit}
              id={i.toString()}
              color={colours[commit.x] ?? 'black'}
              height={i === 0 ? (ROW_HEIGHT - HEIGHT_OFFSET) : ROW_HEIGHT}
              lineWidth={(commit.x * commitNodeSpacing) + GRAPH_LEFT_OFFSET}
              lineRight={0 - PADDING - (commit.x * commitNodeSpacing) - GRAPH_LEFT_OFFSET + 10}
            />
          )
        } else {
          return (
            <div
              key={`empty_tag_${i}`}
              className={styles.tag}
              style={{ height: ROW_HEIGHT }}
            />
          )
        }
      })}
    </div>
  )
}