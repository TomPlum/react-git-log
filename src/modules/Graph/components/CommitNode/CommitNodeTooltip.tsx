import { useTheme } from 'modules/Visualiser/hooks/useTheme'
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
      <p className={styles.text}>
        Hash: {commit.hash}
      </p>

      <p className={styles.text}>
        Parents: {commit.parents.join(', ')}
      </p>

      <p className={styles.text}>
        Children: {commit.children.join(', ')}
      </p>

      <p className={styles.text}>
        Is Branch Tip?: {commit.isBranchTip ? 'Yes' : 'No'}
      </p>
    </div>
  )
}