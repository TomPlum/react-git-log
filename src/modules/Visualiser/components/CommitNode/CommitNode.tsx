import styles from './CommitNode.module.scss'
import { CommitNodeProps } from './types'
import { Popover } from 'react-tiny-popover'
import { useCallback, useState } from 'react'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { useGitContext } from 'modules/Visualiser/context'

interface TooltipProps {
  hash: string
  color?: string
  parents: string[]
  tip: boolean
}

const Tooltip = ({ hash, color, parents, tip }: TooltipProps) => {
  return (
    <div style={{ border: `1px solid ${color}`, background: 'white', color: 'black' }}>
      <p>Hash: {hash}</p>
      <p>Parents: {parents.join(', ')}</p>
      <p>Is Branch Tip?: {tip ? 'Yes' : 'No'}</p>
    </div>
  )
}

export const CommitNode = ({ x, y, hash, parents, commit, showCommitNodeHashes }: CommitNodeProps) => {
  const { textColour, reduceOpacity } = useTheme()
  const [showTooltip, setShowTooltip] = useState(false)
  const { colours, selectedCommit, setSelectedCommit } = useGitContext()

  const nodeColour = colours[commit.x] ?? 'black'

  const handleClickNode = useCallback(() => {
    if (selectedCommit) {
      setSelectedCommit(undefined)
    } else {
      setSelectedCommit(commit)
    }
  }, [commit, selectedCommit, setSelectedCommit])

  return (
    <Popover
      padding={20}
      isOpen={showTooltip}
      content={<Tooltip color={nodeColour} hash={hash} parents={parents} tip={commit.isBranchTip} />}
    >
      <div
        key={hash}
        onClick={handleClickNode}
        className={styles.commitNode}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        style={{
          left: x,
          top: y,
          backgroundColor: reduceOpacity(nodeColour, 0.15),
          borderColor: nodeColour,
        }}
      >
        {showCommitNodeHashes && (
          <span className={styles.commitLabel} style={{ color: textColour }}>
            {hash}
          </span>
        )}
      </div>
    </Popover>
  )
}