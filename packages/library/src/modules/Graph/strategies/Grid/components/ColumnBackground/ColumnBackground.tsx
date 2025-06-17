import { ColumnBackgroundProps } from './types'
import classNames from 'classnames'
import styles from './ColumnBackground.module.scss'
import { CSSProperties, useMemo } from 'react'
import { BACKGROUND_HEIGHT_OFFSET, ROW_HEIGHT } from 'constants/constants'
import { useGitContext } from 'context/GitContext'
import { useGraphContext } from 'modules/Graph/context'
import { getColumnBackgroundSize } from 'modules/Graph/utils/getColumnBackgroundSize'

export const ColumnBackground = ({ id, index, colour, commitNodeIndex }: ColumnBackgroundProps) => {
  const { showTable } = useGitContext()
  const { nodeSize, orientation, highlightedBackgroundHeight } = useGraphContext()

  const height = useMemo<number>(() => {
    if (highlightedBackgroundHeight) {
      return highlightedBackgroundHeight
    }

    const dynamicHeight = nodeSize + BACKGROUND_HEIGHT_OFFSET
    return dynamicHeight > ROW_HEIGHT ? ROW_HEIGHT : dynamicHeight
  }, [highlightedBackgroundHeight, nodeSize])

  const style = useMemo<CSSProperties>(() => {
    const offset = getColumnBackgroundSize({ nodeSize })

    if (!showTable) {
      const backgroundSize = nodeSize + offset

      return {
        borderRadius: '50%',
        height: `${backgroundSize}px`,
        width: `${backgroundSize}px`,
        background: colour,
        left: `calc(50% - ${backgroundSize / 2}px)`
      }
    }


    if (index === commitNodeIndex) {
      return {
        width: `calc(50% + ${nodeSize / 2}px + ${offset / 2}px)`,
        height,
        background: colour,
        right: 0,
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%'
      }
    }

    return {
      height,
      background: colour
    }
  }, [nodeSize, showTable, index, commitNodeIndex, height, colour])

  const shouldShowFullBackground = orientation === 'normal'
    ? index > commitNodeIndex
    : index < commitNodeIndex
  
  return (
    <div
      id={`column-background-${index}-${id}`}
      data-testid={`column-background-${index}-${id}`}
      style={style}
      className={classNames(
        styles.background,
        { [styles.backgroundSquare]: shouldShowFullBackground }
      )}
    />
  )
}