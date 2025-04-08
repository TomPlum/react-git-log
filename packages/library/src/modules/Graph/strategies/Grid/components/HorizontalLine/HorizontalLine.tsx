import classNames from 'classnames'
import styles from './HorizontalLine.module.scss'
import { CSSProperties, useMemo } from 'react'
import { HorizontalLineProps } from 'modules/Graph/strategies/Grid/components/HorizontalLine/types'
import { useTheme } from 'hooks/useTheme'
import { useGraphContext } from 'modules/Graph/context'

export const HorizontalLine = ({ state, columnIndex, commitNodeIndex, columnColour }: HorizontalLineProps) => {
  const { orientation } = useGraphContext()
  const { getGraphColumnColour } = useTheme()

  const { style, variant } = useMemo<{ style: CSSProperties, variant: string }>(() => {
    // Farthest-right active branch takes precedence
    const farthestRightMergeNodeColumnIndex = state?.mergeSourceColumns
      ? Math.max(...state.mergeSourceColumns)
      : undefined
    
    const borderColour = state.isPlaceholderSkeleton
      ? columnColour
      : getGraphColumnColour(farthestRightMergeNodeColumnIndex ?? commitNodeIndex)

    // Border is dotted for the skeleton placeholder elements.
    const borderStyle = state.isPlaceholderSkeleton ? 'dotted' : 'solid'

    // If this column has a node and is being merged into from another,
    // then we don't need to draw behind the node off the edge of the graph,
    // just connect to the horizontal line that wants to connect to it.
    if (state.isNode && state.mergeSourceColumns) {
      const isNormalOrientation = orientation === 'normal'
      const variant = isNormalOrientation ? 'right-half' : 'left-half'
      return {
        variant,
        style: {
          borderTop: `2px ${borderStyle} ${borderColour}`,
          width: '50%',
          right: isNormalOrientation ? 0 : '50%',
          zIndex: columnIndex + 1
        }
      }
    }

    // If no other conditions are met then we can draw a
    // full-width horizontal line.
    const isInFirstColumn = columnIndex === 0

    return {
      variant: isInFirstColumn ? 'right-half' : 'full-width',
      style: {
        borderTop: `2px ${borderStyle} ${borderColour}`,
        width: isInFirstColumn ? '50%' : '100%',
        zIndex: columnIndex + 1,
        right: 0
      }
    }
  }, [state.mergeSourceColumns, state.isPlaceholderSkeleton, state.isNode, columnColour, getGraphColumnColour, commitNodeIndex, columnIndex, orientation])


  return (
    <div
      style={style}
      id={`horizontal-line-${variant}`}
      data-testid={`horizontal-line-${variant}`}
      className={classNames(styles.line, styles.horizontal)}
    />
  )
}