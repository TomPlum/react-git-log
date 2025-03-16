import { ROW_HEIGHT } from 'constants.ts'
import styles from './CurvedEdge.module.scss'
import { useGitContext } from 'context'
import { CurvedEdgeProps } from './types'

export const CurvedEdge = ({ colour, path, dashed }: CurvedEdgeProps) => {
  const { rowSpacing  } = useGitContext()
  return (
    <svg width="100%" height={ROW_HEIGHT + rowSpacing} viewBox={'0 0 100 100'} className={styles.curve} preserveAspectRatio='none'>
      <path
        d={path}
        stroke={colour}
        strokeWidth="2"
        fill="transparent"
        vectorEffect='non-scaling-stroke'
        strokeDasharray={dashed ? '3 4': undefined}
      />
    </svg>
  )
}