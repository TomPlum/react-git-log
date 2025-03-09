import { BranchTagTooltip } from './BranchTagTooltip'
import styles from './BranchTag.module.scss'
import { formatBranch } from 'modules/Visualiser/utils/formatBranch'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { cloneElement, useCallback, useState } from 'react'
import { BranchTagProps } from './types'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { motion } from 'framer-motion'

export const BranchTag = ({ id, branch, height, color, lineRight, lineWidth, icon }: BranchTagProps) => {
  const { textColour, shiftAlphaChannel, tooltipBackground, hoverTransitionDuration } = useTheme()

  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseOver = useCallback(() => {
    setShowTooltip(true)
  }, [])

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false)
  }, [])

  return (
    <Popover
      positions='right'
      isOpen={showTooltip}
      containerClassName={styles.tooltip}
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
            background: shiftAlphaChannel(color, 0.30),
            border: `2px solid ${color}`
          }}
        >
          {formatBranch(branch)}

          {cloneElement(icon, {
            className: styles.icon
          })}
        </div>

        <div
          key={`tag_line_${branch}`}
          className={styles.tagLine}
          style={{
            right: lineRight,
            width: lineWidth,
            borderTop: `2px dotted ${color ?? 'black'}`,
          }}
        />
      </motion.div>
    </Popover>
  )
}