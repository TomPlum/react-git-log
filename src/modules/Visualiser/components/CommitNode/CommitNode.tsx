import styles from './CommitNode.module.scss'
import { CommitNodeProps } from './types'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { useCallback, useState } from 'react'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { useGitContext } from 'modules/Visualiser/context'
import { CommitNodeTooltip } from './CommitNodeTooltip'

export const CommitNode = ({ x, y, hash, parents, commit, showCommitNodeHashes }: CommitNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { colours, selectedCommit, setSelectedCommit } = useGitContext()
  const { textColour, shiftAlphaChannel, tooltipBackground } = useTheme()

  const nodeColour = colours[commit.x] ?? 'black'

  const handleClickNode = useCallback(() => {
    if (selectedCommit?.hash === commit.hash) {
      setSelectedCommit(undefined)
    } else {
      setSelectedCommit(commit)
    }
  }, [commit, selectedCommit, setSelectedCommit])

  return (
    <Popover
      padding={20}
      positions='top'
      isOpen={showTooltip}
      content={({ position, childRect, popoverRect }: PopoverState) => (
        <ArrowContainer
          arrowSize={10}
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={tooltipBackground}
        >
          <CommitNodeTooltip
            hash={hash}
            parents={parents}
            color={nodeColour}
            tip={commit.isBranchTip}
          />
        </ArrowContainer>
      )}
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
          backgroundColor: shiftAlphaChannel(nodeColour, 0.15),
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