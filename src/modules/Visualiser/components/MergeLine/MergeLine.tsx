import styles from './MergeLine.module.scss'
import { MergeLineProps } from './types'

export const MergeLine = ({ id, xStart, yStart, xEnd, yEnd, colour }: MergeLineProps) => {

  const curvePath = `
    M ${xStart},${yStart} 
    C ${xStart},${(yStart + yEnd) / 2} 
      ${xEnd},${(yStart + yEnd) / 2} 
      ${xEnd},${yEnd}
  `

  return (
    <svg key={id} className={styles.mergeLine}>
      <path d={curvePath} stroke={colour ?? 'black'} strokeWidth="2" fill="none" />
    </svg>
  )
}