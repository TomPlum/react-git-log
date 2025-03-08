import styles from './CommitNode.module.scss'
import { CommitNodeProps } from './types'

export const CommitNode = ({ x, y, hash, color }: CommitNodeProps) => {
  return (
    <div
      key={hash}
      className={styles.commitNode}
      style={{
        left: x,
        top: y,
        backgroundColor: color,
      }}
    >
      <span className={styles.commitLabel}>
        {hash}
      </span>
    </div>
  )
}