import styles from './CommitNode.module.scss'
import { CommitNodeProps } from './types'
import { Popover } from 'react-tiny-popover'
import { useState } from 'react'

const Tooltip = ({ x, hash, color, parents }: CommitNodeProps) => {
  return (
    <div style={{ border: `1px solid ${color}`, background: 'white', color: 'black' }}>
      <p>Hash: {hash}</p>
      <p>Parents: {parents.join(', ')}</p>
    </div>
  )
}

export const CommitNode = ({ x, y, hash, color, parents }: CommitNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <Popover
      isOpen={showTooltip}
      padding={20}
      content={<Tooltip x={x} y={y} color={color} hash={hash} parents={parents} />}
    >
      <div
        key={hash}
        className={styles.commitNode}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
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
    </Popover>
  )
}