import styles from './BranchesTags.module.scss'
import { BranchesTagsProps } from './types'
import { colours, ROW_HEIGHT } from 'modules/Visualiser'
import { BranchTag } from './BranchTag'
import { GRAPH_LEFT_OFFSET } from 'modules/Visualiser/components/GitGraph'

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

export const BranchesTags = ({ commits, commitNodeSpacing, previewBranch }: BranchesTagsProps) => {
  return (
    <div className={styles.container} style={{ padding: PADDING }}>
      {commits.map((commit, i) => {
        if (previewBranch && commit.branch === previewBranch.name && commit.hash === previewBranch.hash) {
          return (
            <BranchTag
              key={i}
              id={i.toString()}
              branch={previewBranch.name}
              color={colours[commit.x]}
              height={i === 0 ? (ROW_HEIGHT - HEIGHT_OFFSET) : ROW_HEIGHT}
              lineWidth={(commit.x * commitNodeSpacing) + GRAPH_LEFT_OFFSET}
              lineRight={0 - PADDING - (commit.x * commitNodeSpacing) - GRAPH_LEFT_OFFSET + 10}
            />
          )
        }

        if (commit.isBranchTip) {
          return (
            <BranchTag
              key={i}
              id={i.toString()}
              branch={commit.branch}
              color={colours[commit.x]}
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