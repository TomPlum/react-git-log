import styles from './BranchesTags.module.scss'
import { BranchesTagsProps } from './types'
import { ROW_HEIGHT } from 'modules/Visualiser'
import { formatBranch } from 'modules/Visualiser/utils/formatBranch'
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

export const BranchesTags = ({ commits, commitNodeSpacing }: BranchesTagsProps) => {
  return (
    <div className={styles.container} style={{ padding: PADDING }}>
      {commits.map((commit, i) => {
        if (commit.isBranchTip) {
          return (
            <div className={styles.tagContainer}>
              <div
                key={`tag_${i}`}
                className={styles.tag}
                title={commit.branch}
                style={{ height: ROW_HEIGHT - HEIGHT_OFFSET }}
              >
                {formatBranch(commit.branch)}
              </div>

              <div
                key={`tag_line_${commit.branch}`}
                className={styles.tagLine}
                style={{
                  right: 0 - PADDING - (commit.x * commitNodeSpacing) - GRAPH_LEFT_OFFSET,
                  width: (commit.x * commitNodeSpacing) + GRAPH_LEFT_OFFSET
                }}
              />
            </div>
          )
        } else {
          return (
            <div
              key={`empty_tag_${i}`}
              className={styles.tag}
              style={{ height: ROW_HEIGHT - HEIGHT_OFFSET }}
            />
          )
        }
      })}
    </div>
  )
}