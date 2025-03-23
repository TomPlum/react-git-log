import styles from './BranchTagTooltip.module.scss'
import { useTheme } from 'hooks/useTheme'
import { BranchTagTooltipProps } from './types'

export const BranchTagTooltip = ({ id, commit }: BranchTagTooltipProps) => {
  const { textColour, getTooltipBackground, getCommitColour } = useTheme()

  const colour = getTooltipBackground(commit)

  return (
    <div
      className={styles.tooltip}
      id={`tag-${id}-tooltip`}
      data-testid={`tag-${id}-tooltip`}
      style={{
        color: textColour,
        background: colour,
        border: `2px solid ${getCommitColour(commit)}`,
      }}
    >
      {commit.branch}
    </div>
  )
}