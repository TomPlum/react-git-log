import classNames from 'classnames'
import styles from './ColumnSelectedBackground.module.scss'
import { CSSProperties, useMemo } from 'react'
import { ROW_HEIGHT } from 'constants.ts'
import { useTheme } from 'hooks/useTheme'
import { useGitContext } from 'context'
import { ColumnSelectedBackgroundProps } from './types'
import { FadingDiv } from 'components/FadingDiv'

export const ColumnSelectedBackground = ({ index, commitNodeIndex }: ColumnSelectedBackgroundProps) => {
  const { showGitLog } = useGitContext()
  const { getGraphColumnColour, reduceOpacity } = useTheme()

  const columnContainsCommitNode = index === commitNodeIndex

  const selectedBackgroundStyles = useMemo<CSSProperties>(() => {
    const NODE_SIZE = 24 // TODO: Source dynamically once prop exposed

    // 8 pixels either side of the node
    const offset = 16

    const width = showGitLog
      ? `calc(50% + ${NODE_SIZE}px - ${offset / 4}px)`
      : NODE_SIZE + offset

    if (columnContainsCommitNode) {
      return {
        width,
        height: ROW_HEIGHT,
        left: `calc(50% - ${NODE_SIZE}px + ${offset / 4}px)`,
        background: reduceOpacity(getGraphColumnColour(commitNodeIndex), 0.15)
      }
    }

    return {
      height: ROW_HEIGHT,
      background: reduceOpacity(getGraphColumnColour(commitNodeIndex), 0.15)
    }
  }, [columnContainsCommitNode, commitNodeIndex, getGraphColumnColour, reduceOpacity, showGitLog])

  return (
    <FadingDiv
      style={selectedBackgroundStyles}
      className={classNames(
        styles.selectedBackground,
        { [styles.noLogBackground]: !showGitLog },
        { [styles.selectedBackgroundSquare]: index > commitNodeIndex },
        { [styles.selectedBackgroundBehindNode]: columnContainsCommitNode }
      )}
    />
  )
}