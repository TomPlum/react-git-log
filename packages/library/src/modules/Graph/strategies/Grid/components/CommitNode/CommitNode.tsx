import styles from './CommitNode.module.scss'
import { CommitNodeProps } from './types'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { CSSProperties, useCallback, useMemo, useState } from 'react'
import { useTheme } from 'hooks/useTheme'
import { CommitNodeTooltip } from '../CommitNodeTooltip'
import { useSelectCommit } from 'hooks/useSelectCommit'
import { NODE_BORDER_WIDTH } from 'constants/constants'
import { useGraphContext } from 'modules/Graph/context'
import { useGitContext } from 'context/GitContext'

export const CommitNode = ({ commit, colour }: CommitNodeProps) => {
  const { selectCommitHandler } = useSelectCommit()
  const { remoteProviderUrlBuilder } = useGitContext()
  const { textColour, shiftAlphaChannel, theme } = useTheme()
  const { showCommitNodeTooltips, showCommitNodeHashes, nodeTheme, nodeSize } = useGraphContext()

  const commitHashLabelHeight = 20
  const isMergeCommit = nodeTheme === 'default' && commit.parents.length > 1
  const commitUrl = remoteProviderUrlBuilder?.({ commit })?.commit

  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseOver = useCallback(() => {
    setShowTooltip(true)
    selectCommitHandler.onMouseOver(commit)
  }, [commit, selectCommitHandler])

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false)
    selectCommitHandler.onMouseOut()
  }, [selectCommitHandler])

  const nodeStyles = useMemo<CSSProperties>(() => {
    return {
      width: nodeSize,
      height: nodeSize,
      backgroundColor: shiftAlphaChannel(colour, 0.15),
      border: `${NODE_BORDER_WIDTH}px solid ${colour}`,
    }
  }, [colour, nodeSize, shiftAlphaChannel])

  const mergeInnerNodeStyles = useMemo<CSSProperties>(() => {
    const diameter = nodeSize > 10 ? nodeSize - 6 : nodeSize - 2
    return {
      background: colour,
      width: diameter,
      height: diameter,
      top: `calc(50% - ${diameter / 2}px)`,
      left: `calc(50% - ${diameter / 2}px)`
    }
  }, [colour, nodeSize])

  const handleClickNode = useCallback(() => {
    selectCommitHandler.onClick(commit)

    if (commitUrl) {
      window.open(commitUrl, '_blank')
    }
  }, [commit, commitUrl, selectCommitHandler])

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
        style={nodeStyles}
        onClick={handleClickNode}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        className={styles.commitNode}
        id={`commit-node-${commit.hash}`}
        data-testid={`commit-node-${commit.hash}`}
        title={commitUrl ? 'View Commit' : undefined}
      >
        {isMergeCommit && (
          <div
            style={mergeInnerNodeStyles}
            className={styles.mergeCommitInner}
            id={`commit-node-merge-circle-${commit.hash}`}
            data-testid={`commit-node-merge-circle-${commit.hash}`}
          />
        )}

        {showCommitNodeHashes && (
          <span
            id={`commit-node-hash-${commit.hash}`}
            data-testid={`commit-node-hash-${commit.hash}`}
            className={styles.commitLabel}
            style={{
              color: textColour,
              height: commitHashLabelHeight,
              left: `calc(50% + ${nodeSize / 2}px + 5px)`,
              top: `calc(50% - ${commitHashLabelHeight / 2}px)`,
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