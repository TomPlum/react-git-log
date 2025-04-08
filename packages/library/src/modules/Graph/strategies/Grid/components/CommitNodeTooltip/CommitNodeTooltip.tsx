import { useTheme } from 'hooks/useTheme'
import styles from './CommitNodeTooltip.module.scss'
import { CommitNodeTooltipProps } from './types'

export const CommitNodeTooltip = ({ commit, color }: CommitNodeTooltipProps) => {
  const { textColour, getTooltipBackground } = useTheme()

  return (
    <div
      className={styles.tooltip}
      id={`commit-node-tooltip-${commit.hash}`}
      data-testid={`commit-node-tooltip-${commit.hash}`}
      style={{
        color: textColour,
        border: `2px solid ${color}`,
        background: getTooltipBackground(commit)
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

      <div>
        <p className={styles.label}>
          Branch Tip:
        </p>

        <p className={styles.text}>
          {commit.isBranchTip ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  )
}