import styles from './BranchTagTooltip.module.scss'
import { BranchTagTooltipProps } from './types'

export const BranchTagTooltip = ({ branch }: BranchTagTooltipProps) => {
  return (
    <div className={styles.tooltip}>
      {branch}
    </div>
  )
}