import { BranchTagTooltip } from './BranchTagTooltip'
import styles from './BranchTag.module.scss'
import { formatBranch } from 'modules/Visualiser/utils/formatBranch'
import { ArrowContainer, Popover, PopoverState } from 'react-tiny-popover'
import { useCallback, useState } from 'react'
import { BranchTagProps } from './types'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import BranchIcon from 'assets/branch.svg?react'

export const BranchTag = ({ id, branch, height, color, lineRight, lineWidth }: BranchTagProps) => {
  const { textColour, shiftAlphaChannel, tooltipBackground } = useTheme()

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
      <div
        style={{ height }}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
        className={styles.tagContainer}
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

          <BranchIcon
            className={styles.icon}
            style={{
              fill: textColour
            }}
          />
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
      </div>
    </Popover>
  )
}