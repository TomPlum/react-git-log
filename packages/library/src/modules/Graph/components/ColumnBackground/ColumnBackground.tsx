import { ColumnBackgroundProps } from './types'
import classNames from 'classnames'
import styles from './ColumnBackground.module.scss'
import { CSSProperties, useMemo } from 'react'
import { BACKGROUND_HEIGHT_OFFSET, ROW_HEIGHT } from 'constants/constants'
import { useGitContext } from 'context/GitContext'
import { useGraphContext } from 'modules/Graph/context'

export const ColumnBackground = ({ id, index, colour, commitNodeIndex }: ColumnBackgroundProps) => {
  const { showTable } = useGitContext()
  const { nodeSize } = useGraphContext()

  const style = useMemo<CSSProperties>(() => {
    // 4 or 8 pixels either side of the node
    const offset = (nodeSize <= 16 ? 6 : 8) * 2

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

    const dynamicHeight = nodeSize + BACKGROUND_HEIGHT_OFFSET
    const height = dynamicHeight > ROW_HEIGHT ? ROW_HEIGHT : dynamicHeight


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
  }, [showTable, nodeSize, index, commitNodeIndex, colour])
  
  return (
    <div
      id={`column-background-${index}-${id}`}
      data-testid={`column-background-${index}-${id}`}
      style={style}
      className={classNames(
        styles.background,
        { [styles.backgroundSquare]: index > commitNodeIndex }
      )}
    />
  )
}