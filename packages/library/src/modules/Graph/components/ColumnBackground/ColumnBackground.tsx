import { ColumnBackgroundProps } from './types'
import classNames from 'classnames'
import styles from './ColumnBackground.module.scss'
import { FadingDiv } from 'components/FadingDiv'
import { CSSProperties, useMemo } from 'react'
import { NODE_BORDER_WIDTH, NODE_WIDTH, ROW_HEIGHT } from 'constants/constants'
import { useGitContext } from 'context/GitContext'

export const ColumnBackground = ({ index, colour, commitNodeIndex }: ColumnBackgroundProps) => {
  const { showGitLog } = useGitContext()

  const previewedBackgroundStyles = useMemo<CSSProperties>(() => {
    // 8 pixels either side of the node
    const offset = 8 * 2
    const widthOffset = offset / (NODE_BORDER_WIDTH * 2)

    const width = showGitLog
      ? `calc(50% + ${NODE_WIDTH}px - ${widthOffset}px)`
      : NODE_WIDTH + offset

    if (index === commitNodeIndex) {
      return {
        width,
        background: colour,
        height: ROW_HEIGHT,
        left: `calc(50% - ${NODE_WIDTH}px + ${widthOffset}px)`
      }
    }

    return {
      height: ROW_HEIGHT,
      background: colour
    }
  }, [commitNodeIndex, colour, index, showGitLog])
  
  return (
    <FadingDiv
      style={previewedBackgroundStyles}
      className={classNames(
        styles.background,
        { [styles.noLogBackground]: !showGitLog },
        { [styles.backgroundSquare]: index > commitNodeIndex },
        { [styles.backgroundBehindNode]: index === commitNodeIndex }
      )}
    />
  )
}