import styles from './BranchTagTooltip.module.scss'
import { BranchTagTooltipProps } from './types'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'

export const BranchTagTooltip = ({ branch }: BranchTagTooltipProps) => {
  const { textColour, tooltipBackground } = useTheme()

  return (
    <div
      className={styles.tooltip}
      style={{
        color: textColour,
        background: tooltipBackground
      }}
    >
      {branch}
    </div>
  )
}