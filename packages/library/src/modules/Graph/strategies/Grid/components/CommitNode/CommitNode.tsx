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
import { getMergeNodeInnerSize } from 'modules/Graph/utils/getMergeNodeInnerSize'

export const CommitNode = ({ commit, colour }: CommitNodeProps) => {
  const { selectCommitHandler } = useSelectCommit()
  const { remoteProviderUrlBuilder } = useGitContext()
  const { textColour, theme, getCommitNodeColours } = useTheme()
  const { showCommitNodeTooltips, showCommitNodeHashes, nodeTheme, nodeSize } = useGraphContext()

  const commitHashLabelHeight = 20
  const isMergeCommit = nodeTheme === 'default' && commit.parents.length > 1
  const commitUrl = remoteProviderUrlBuilder?.({ commit })?.commit
  const { borderColour, backgroundColour } = getCommitNodeColours({ columnColour: colour })

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
      backgroundColor: backgroundColour,
      border: `${NODE_BORDER_WIDTH}px solid ${borderColour}`,
    }
  }, [borderColour, nodeSize, backgroundColour])

  const mergeInnerNodeStyles = useMemo<CSSProperties>(() => {
    const diameter = getMergeNodeInnerSize({ nodeSize })
    return {
      background: borderColour,
      width: diameter,
      height: diameter,
      top: `calc(50% - ${diameter / 2}px)`,
      left: `calc(50% - ${diameter / 2}px)`
    }
  }, [borderColour, nodeSize])

  const handleClickNode = useCallback(() => {
    selectCommitHandler.onClick(commit)

    if (commitUrl) {
      window.open(commitUrl, '_blank')
    }
  }, [commit, commitUrl, selectCommitHandler])

  const getTooltipContent = useCallback(({ position, childRect, popoverRect }: PopoverState) => (
    <ArrowContainer
      arrowSize={10}
      arrowColor={borderColour}
      position={position}
      childRect={childRect}
      popoverRect={popoverRect}
    >
      <CommitNodeTooltip
        commit={commit}
        color={borderColour}
      />
    </ArrowContainer>
  ), [borderColour, commit])

  return (
    <Popover
      padding={0}
      content={getTooltipContent}
      positions={['top', 'bottom']}
      containerStyle={{ zIndex: '20' }}
      isOpen={showCommitNodeTooltips ? showTooltip : false}
    >
      <div
        role='button'
        tabIndex={0}
        key={commit.hash}
        style={nodeStyles}
        onBlur={handleMouseOut}
        onFocus={handleMouseOver}
        onClick={handleClickNode}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        className={styles.commitNode}
        id={`commit-node-${commit.hash}`}
        data-testid={`commit-node-${commit.hash}`}
        title={commitUrl ? 'View Commit' : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleClickNode()
          }
        }}
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