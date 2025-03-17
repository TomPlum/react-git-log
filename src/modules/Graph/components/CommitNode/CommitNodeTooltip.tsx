import { useTheme } from 'hooks/useTheme'
import styles from './CommitNodeTooltip.module.scss'
import { Commit } from 'modules/Visualiser'

export interface CommitNodeTooltipProps {
  commit: Commit
  color?: string
}

export const CommitNodeTooltip = ({ commit, color }: CommitNodeTooltipProps) => {
  const { textColour, getCommitColour, shiftAlphaChannel } = useTheme()

  return (
    <div
      className={styles.tooltip}
      style={{
        border: `2px solid ${color}`,
        background: shiftAlphaChannel(getCommitColour(commit), 0.2),
        color: textColour
      }}
    >
      <div>
        <p className={styles.label}>
          Hash:
        </p>

        <p className={styles.text}>
          {commit.hash}
        </p>
      </div>

      <div>
        <p className={styles.label}>
          Parents:
        </p>

        <p className={styles.text}>
          {commit.parents.length > 0 ? commit.parents.join(', ') : 'None'}
        </p>
      </div>

      <div>
        <p className={styles.label}>
          Children:
        </p>

        <p className={styles.text}>
          {commit.children.length > 0 ? commit.children.join(', ') : 'None'}
        </p>
      </div>

      <p className={styles.text}>
        Branch Tip: {commit.isBranchTip ? 'Yes' : 'No'}
      </p>
    </div>
  )
}