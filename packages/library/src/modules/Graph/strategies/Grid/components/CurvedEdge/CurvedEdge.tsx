import styles from './CurvedEdge.module.scss'
import { CurvedEdgeProps } from './types'
import { CURVE_SIZE } from 'constants/constants'

export const CurvedEdge = ({ id, colour, path, dashed }: CurvedEdgeProps) => {
  return (
    <svg
      id={id}
      data-testid={id}
      width={CURVE_SIZE}
      height={CURVE_SIZE}
      viewBox={'0 0 100 100'}
      className={styles.curve}
      preserveAspectRatio='none'
    >
      <path
        d={path}
        stroke={colour}
        strokeWidth="2"
        fill="transparent"
        vectorEffect='non-scaling-stroke'
        strokeDasharray={dashed ? '2 2': undefined}
      />
    </svg>
  )
}