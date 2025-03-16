import { ColumnPreviewedBackgroundProps } from './types'
import classNames from 'classnames'
import styles from './ColumnPreviewedBackground.module.scss'
import { FadingDiv } from 'components/FadingDiv'
import { CSSProperties, useMemo } from 'react'
import { ROW_HEIGHT } from 'constants.ts'
import { useGitContext } from 'context'
import { useTheme } from 'hooks/useTheme'

export const ColumnPreviewedBackground = ({ index, commitNodeIndex }: ColumnPreviewedBackgroundProps) => {
  const { hoverColour } = useTheme()
  const { showGitLog } = useGitContext()

  const previewedBackgroundStyles = useMemo<CSSProperties>(() => {
    const NODE_SIZE = 24 // TODO: Source dynamically once prop exposed

    // 8 pixels either side of the node
    const offset = 16

    const width = showGitLog
      ? `calc(50% + ${NODE_SIZE}px - ${offset / 4}px)`
      : NODE_SIZE + offset

    if (index === commitNodeIndex) {
      return {
        width,
        background: hoverColour,
        height: ROW_HEIGHT
      }
    }

    return {
      height: ROW_HEIGHT,
      background: hoverColour
    }
  }, [commitNodeIndex, hoverColour, index, showGitLog])
  
  return (
    <FadingDiv
      style={previewedBackgroundStyles}
      className={classNames(
        styles.previewedBackground,
        { [styles.noLogBackground]: !showGitLog },
        { [styles.previewedBackgroundSquare]: index > commitNodeIndex },
        { [styles.previewedBackgroundBehindNode]: index === commitNodeIndex }
      )}
    />
  )
}