import styles from './BranchLine.module.scss'
import { BranchLineProps } from './types.ts'

export const BranchLine = ({ id, x, y, height, color }: BranchLineProps) => {
  return (
    <div
      key={id}
      className={styles.branchLine}
      style={{
        left: x,
        top: y,
        height,
        background: color
      }}
    />
  )
}