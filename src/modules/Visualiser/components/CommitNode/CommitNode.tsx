import styles from './CommitNode.module.scss'
import { CommitNodeProps } from './types'
import { Popover } from 'react-tiny-popover'
import { useState } from 'react'

const Tooltip = ({ hash, color, parents }: Pick<CommitNodeProps, 'hash' | 'color' | 'parents'>) => {
  return (
    <div style={{ border: `1px solid ${color}`, background: 'white', color: 'black' }}>
      <p>Hash: {hash}</p>
      <p>Parents: {parents.join(', ')}</p>
    </div>
  )
}

export const CommitNode = ({ x, y, hash, color, parents, onClick, commit }: CommitNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <Popover
      padding={20}
      isOpen={showTooltip}
      content={<Tooltip color={color} hash={hash} parents={parents} />}
    >
      <div
        key={hash}
        onClick={() => onClick(commit)}
        className={styles.commitNode}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        style={{
          left: x,
          top: y,
          borderColor: color,
        }}
      >
        <span className={styles.commitLabel}>
          {hash}
        </span>
      </div>
    </Popover>
  )
}