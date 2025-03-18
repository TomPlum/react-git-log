import styles from './CommitNode.module.scss'
import { CommitNodeProps } from './types'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { useCallback, useState } from 'react'
import { useTheme } from 'hooks/useTheme'
import { useGitContext } from 'context/GitContext'
import { CommitNodeTooltip } from '../CommitNodeTooltip'
import { useSelectCommit } from 'hooks/useSelectCommit'
import { NODE_BORDER_WIDTH } from 'constants/constants'

export const CommitNode = ({ commit, colour }: CommitNodeProps) => {
  const { selectCommitHandler } = useSelectCommit()
  const { textColour, shiftAlphaChannel, theme } = useTheme()
  const { showCommitNodeTooltips, showCommitNodeHashes } = useGitContext()

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
      padding={0}
      positions={['top', 'bottom']}
      containerStyle={{ zIndex: '20' }}
      isOpen={showCommitNodeTooltips ? showTooltip : false}
      content={({ position, childRect, popoverRect }: PopoverState) => (
        <ArrowContainer
          arrowSize={10}
          arrowColor={colour}
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
        >
          <CommitNodeTooltip
            commit={commit}
            color={colour}
          />
        </ArrowContainer>
      )}
    >
      <div
        key={commit.hash}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        className={styles.commitNode}
        onClick={() => selectCommitHandler.onClick(commit)}
        style={{
          backgroundColor: shiftAlphaChannel(colour, 0.15),
          border: `${NODE_BORDER_WIDTH}px solid ${colour}`,
        }}
      >
        {showCommitNodeHashes && (
          <span
            className={styles.commitLabel}
            style={{
              color: textColour,
              background: theme === 'dark' ? 'rgb(26,26,26)' : 'white',
            }}
          >
            {commit.hash}
          </span>
        )}
      </div>
    </Popover>
  )
}