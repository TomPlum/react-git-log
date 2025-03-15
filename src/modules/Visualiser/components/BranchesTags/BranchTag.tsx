import { BranchTagTooltip } from './BranchTagTooltip'
import styles from './BranchTag.module.scss'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { CSSProperties, useCallback, useMemo, useState } from 'react'
import { BranchTagProps } from './types'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { FadingDiv } from 'components/FadingDiv'
import { BranchLabel } from './BranchLabel'
import { TagLabel } from './TagLabel'
import { IndexLabel } from 'modules/Visualiser/components/BranchesTags/IndexLabel'

export const BranchTag = ({ id, commit, height, color, lineRight, lineWidth }: BranchTagProps) => {
  const { textColour, shiftAlphaChannel, tooltipBackground } = useTheme()

  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseOver = useCallback(() => {
    setShowTooltip(true)
  }, [])

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false)
  }, [])

  const tagLineStyles = useMemo<CSSProperties>(() => {
    return {
      right: lineRight,
      width: lineWidth,
      borderTop: `2px dotted ${color}`,
    }
  }, [color, lineRight, lineWidth])

  const tagContainerStyles = useMemo<CSSProperties>(() => {
    if (commit.hash === 'index') {
      return {
        color: textColour,
        border: `2px dotted ${shiftAlphaChannel(color, 0.50)}`,
        background: shiftAlphaChannel(color, 0.05)
      }
    }

    return {
      color: textColour,
      border: `2px solid ${color}`,
      background: shiftAlphaChannel(color, 0.30)
    }
  }, [color, commit.hash, shiftAlphaChannel, textColour])

  const label = useMemo(() => {
    if (commit.hash === 'index') {
      return (
        <IndexLabel />
      )
    }
    
    if (commit.branch.includes('tags/')) {
      return (
        <TagLabel name={commit.branch} />
      )
    }

    return (
      <BranchLabel name={commit.branch} />
    )
  }, [commit.branch, commit.hash])

  return (
    <Popover
      positions='right'
      isOpen={showTooltip}
      containerStyle={{ zIndex: '20' }}
      content={({ position, childRect, popoverRect }: PopoverState) => (
        <ArrowContainer
          arrowSize={6}
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={tooltipBackground}
        >
          <BranchTagTooltip branch={commit.branch} />
        </ArrowContainer>
      )}
    >
      <FadingDiv
        style={{ height }}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        className={styles.tagContainer}
      >
        <div
          key={`tag_${id}`}
          className={styles.tag}
          style={tagContainerStyles}
        >
          {label}
        </div>

        <div
          style={tagLineStyles}
          className={styles.tagLine}
          key={`tag_line_${commit.branch}`}
        />
      </FadingDiv>
    </Popover>
  )
}