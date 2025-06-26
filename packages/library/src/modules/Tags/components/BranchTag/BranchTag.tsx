import { BranchTagTooltip } from '../BranchTagTooltip'
import styles from './BranchTag.module.scss'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { CSSProperties, useCallback, useMemo, useState } from 'react'
import { useTheme } from 'hooks/useTheme'
import { BranchLabel } from '../BranchLabel'
import { TagLabel } from '../TagLabel'
import { IndexLabel } from 'modules/Tags/components/IndexLabel'
import { BranchTagProps } from './types'
import { useGitContext } from 'context/GitContext'

export const BranchTag = ({ id, commit, height, lineRight, lineWidth }: BranchTagProps) => {
  const { textColour, shiftAlphaChannel, getCommitColour } = useTheme()
  const { selectedCommit, previewedCommit, enablePreviewedCommitStyling, enableSelectedCommitStyling } = useGitContext()

  const colour = getCommitColour(commit)

  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseOver = useCallback(() => {
    setShowTooltip(true)
  }, [])

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false)
  }, [])

  const tagLineStyles = useMemo<CSSProperties>(() => {
    const isPreviewCommit = commit.hash === previewedCommit?.hash && enablePreviewedCommitStyling
    const isSelectedCommit = commit.hash === selectedCommit?.hash && enableSelectedCommitStyling

    const previewOrDefaultOpacity = isPreviewCommit ? 0.8 : 0.4
    const opacity: number = isSelectedCommit ? 1 : previewOrDefaultOpacity
    
    return {
      opacity,
      right: lineRight,
      width: lineWidth,
      borderTop: `2px dotted ${colour}`,
      animationDuration: isPreviewCommit ? '0s' : '0.3s'
    }
  }, [colour, commit.hash, enablePreviewedCommitStyling, enableSelectedCommitStyling, lineRight, lineWidth, previewedCommit?.hash, selectedCommit?.hash])

  const tagLabelContainerStyles = useMemo<CSSProperties>(() => {
    if (commit.hash === 'index') {
      return {
        color: textColour,
        border: `2px dashed ${shiftAlphaChannel(colour, 0.50)}`,
        background: shiftAlphaChannel(colour, 0.05)
      }
    }

    return {
      color: textColour,
      border: `2px solid ${colour}`,
      background: shiftAlphaChannel(colour, 0.30)
    }
  }, [colour, commit.hash, shiftAlphaChannel, textColour])

  const label = useMemo(() => {
    if (commit.hash === 'index') {
      return (
        <IndexLabel />
      )
    }
    
    if (commit.branch.includes('tags/')) {
      return (
        <TagLabel commit={commit} />
      )
    }

    return (
      <BranchLabel commit={commit} />
    )
  }, [commit])

  const getTooltipContent = useCallback(({ position, childRect, popoverRect }: PopoverState) => (
    <ArrowContainer
      arrowSize={6}
      position={position}
      childRect={childRect}
      arrowColor={colour}
      popoverRect={popoverRect}
    >
      <BranchTagTooltip
        id={id}
        commit={commit}
      />
    </ArrowContainer>
  ), [colour, commit, id])

  return (
    <Popover
      positions='right'
      isOpen={showTooltip}
      content={getTooltipContent}
      containerStyle={{ zIndex: '20' }}
    >
      <button
        id={`tag-${id}`}
        style={{ height }}
        data-testid={`tag-${id}`}
        onBlur={handleMouseOut}
        onFocus={handleMouseOver}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        className={styles.tagContainer}
      >
        <span
          id={`tag-label-${id}`}
          key={`tag-label-${id}`}
          className={styles.tag}
          data-testid={`tag-label-${id}`}
          style={tagLabelContainerStyles}
        >
          {label}
        </span>

        <span
          style={tagLineStyles}
          id={`tag-line-${id}`}
          className={styles.tagLine}
          data-testid={`tag-line-${id}`}
          key={`tag-line-${commit.branch}`}
        />
      </button>
    </Popover>
  )
}