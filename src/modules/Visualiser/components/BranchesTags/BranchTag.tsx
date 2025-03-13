import { BranchTagTooltip } from './BranchTagTooltip'
import styles from './BranchTag.module.scss'
import { formatBranch } from 'modules/Visualiser/utils/formatBranch'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { cloneElement, CSSProperties, useCallback, useMemo, useState } from 'react'
import { BranchTagProps } from './types'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { motion } from 'framer-motion'
import { useGitContext } from 'modules/Visualiser/context'

export const BranchTag = ({ id, branch, hash, height, color, lineRight, lineWidth, icon }: BranchTagProps) => {
  const { selectedCommit, previewedCommit } = useGitContext()
  const { textColour, shiftAlphaChannel, tooltipBackground, hoverTransitionDuration } = useTheme()

  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseOver = useCallback(() => {
    setShowTooltip(true)
  }, [])

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false)
  }, [])

  const tagLineStyles = useMemo<CSSProperties>(() => {
    const tagBelongsToSelectedCommit = selectedCommit?.hash === hash
    const tagBelongsToPreviewedCommit = previewedCommit?.hash === hash
    const borderStyle = tagBelongsToSelectedCommit || tagBelongsToPreviewedCommit
      ? 'dashed'
      : 'dotted'

    return {
      right: lineRight,
      width: lineWidth,
      borderTop: `2px ${borderStyle} ${color}`,
    }
  }, [color, hash, lineRight, lineWidth, previewedCommit?.hash, selectedCommit?.hash])

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
          <BranchTagTooltip branch={branch} />
        </ArrowContainer>
      )}
    >
      <motion.div
        style={{ height }}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        className={styles.tagContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: hoverTransitionDuration }}
      >
        <div
          key={`tag_${id}`}
          className={styles.tag}
          style={{
            color: textColour,
            border: `2px solid ${color}`,
            background: shiftAlphaChannel(color, 0.30)
          }}
        >
          {formatBranch(branch)}

          {cloneElement(icon, {
            className: styles.icon
          })}
        </div>

        <div
          style={tagLineStyles}
          key={`tag_line_${branch}`}
          className={styles.tagLine}
        />
      </motion.div>
    </Popover>
  )
}