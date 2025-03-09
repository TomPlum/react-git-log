import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import styles from './CommitNodeTooltip.module.scss'

export interface CommitNodeTooltipProps {
  hash: string
  color?: string
  parents: string[]
  tip: boolean
}

export const CommitNodeTooltip = ({ hash, color, parents, tip }: CommitNodeTooltipProps) => {
  const { textColour, tooltipBackground } = useTheme()

  return (
    <div
      className={styles.tooltip}
      style={{
        border: `1px solid ${color}`,
        background: tooltipBackground,
        color: textColour
      }}
    >
      <p>Hash: {hash}</p>
      <p>Parents: {parents.join(', ')}</p>
      <p>Is Branch Tip?: {tip ? 'Yes' : 'No'}</p>
    </div>
  )
}