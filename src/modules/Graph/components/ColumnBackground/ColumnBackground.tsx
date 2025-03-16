import { ColumnBackgroundProps } from './types'
import classNames from 'classnames'
import styles from './ColumnBackground.module.scss'
import { FadingDiv } from 'components/FadingDiv'
import { CSSProperties, useMemo } from 'react'
import { ROW_HEIGHT } from 'constants.ts'
import { useGitContext } from 'context'

export const ColumnBackground = ({ index, colour, commitNodeIndex }: ColumnBackgroundProps) => {
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
        background: colour,
        height: ROW_HEIGHT,
        left: `calc(50% - ${NODE_SIZE}px + ${offset / 4}px)`
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