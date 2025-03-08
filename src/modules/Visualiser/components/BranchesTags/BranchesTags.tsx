import styles from './BranchesTags.module.scss'
import { BranchesTagsProps } from './types'
import { ROW_HEIGHT } from 'modules/Visualiser'
import { formatBranch } from 'modules/Visualiser/utils/formatBranch'

export const BranchesTags = ({ commits }: BranchesTagsProps) => {
  return (
    <div className={styles.container}>
      {commits.map((commit, i) => {
        if (commit.isBranchTip) {
          return (
            <div
              key={`tag_${i}`}
              className={styles.tag}
              title={commit.branch}
              style={{ height: ROW_HEIGHT - 5 }}
            >
              {formatBranch(commit.branch)}
            </div>
          )
        } else {
          return (
            <div
              key={`empty_tag_${i}`}
              className={styles.tag}
              style={{ height: ROW_HEIGHT - 5 }}
            />
          )
        }
      })}
    </div>
  )
}