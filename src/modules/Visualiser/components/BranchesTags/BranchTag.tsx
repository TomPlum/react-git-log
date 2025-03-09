import { BranchTagTooltip } from './BranchTagTooltip'
import styles from './BranchTag.module.scss'
import { formatBranch } from 'modules/Visualiser/utils/formatBranch'
import { Popover } from 'react-tiny-popover'
import { useCallback, useState } from 'react'
import { BranchTagProps } from './types'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'

export const BranchTag = ({ id, branch, height, color, lineRight, lineWidth }: BranchTagProps) => {
  const { textColour } = useTheme()

  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseOver = useCallback(() => {
    setShowTooltip(true)
  }, [])

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false)
  }, [])

  return (
    <Popover
      isOpen={showTooltip}
      content={<BranchTagTooltip branch={branch} />
    }>
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
            background: color
          }}
        >
          {formatBranch(branch)}
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