import styles from './CommitNode.module.scss'
import { CommitNodeProps } from './types'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { useCallback, useState } from 'react'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { useGitContext } from 'modules/Visualiser/context'
import { CommitNodeTooltip } from './CommitNodeTooltip'
import { useSelectCommit } from 'modules/Visualiser/hooks/useSelectCommit'

export const CommitNode = ({ hash, parents, commit, colour, showCommitNodeHashes }: CommitNodeProps) => {
  const { selectCommitHandler } = useSelectCommit()
  const { showCommitNodeTooltips } = useGitContext()
  const { textColour, shiftAlphaChannel, tooltipBackground } = useTheme()

  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseOver = useCallback(() => {
    setShowTooltip(true)
    selectCommitHandler.onMouseOver(commit)
  }, [commit, selectCommitHandler])

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false)
    selectCommitHandler.onMouseOut()
  }, [selectCommitHandler])

  return (
    <Popover
      padding={20}
      positions='top'
      containerStyle={{ zIndex: '20' }}
      isOpen={showCommitNodeTooltips ? showTooltip : false}
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
            color={colour}
            tip={commit.isBranchTip}
          />
        </ArrowContainer>
      )}
    >
      <div
        key={hash}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        className={styles.commitNode}
        onClick={() => selectCommitHandler.onClick(commit)}
        style={{
          backgroundColor: shiftAlphaChannel(colour, 0.15),
          borderColor: colour,
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