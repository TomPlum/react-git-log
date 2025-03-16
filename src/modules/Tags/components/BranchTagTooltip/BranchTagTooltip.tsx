import styles from './BranchTagTooltip.module.scss'
import { useTheme } from 'hooks/useTheme'
import { BranchTagTooltipProps } from './types'

export const BranchTagTooltip = ({ branch }: BranchTagTooltipProps) => {
  const { textColour, tooltipBackground, shiftAlphaChannel } = useTheme()

  return (
    <div
      className={styles.tooltip}
      style={{
        color: textColour,
        background: tooltipBackground,
        border: `2px solid ${shiftAlphaChannel(tooltipBackground, 1.2)}`,
      }}
    >
      {branch}
    </div>
  )
}