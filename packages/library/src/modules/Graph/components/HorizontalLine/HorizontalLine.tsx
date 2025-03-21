import classNames from 'classnames'
import styles from './HorizontalLine.module.scss'
import { CSSProperties, useMemo } from 'react'
import { HorizontalLineProps } from 'modules/Graph/components/HorizontalLine/types'
import { useTheme } from 'hooks/useTheme'

export const HorizontalLine = ({ state, columnIndex, commitNodeIndex, columnColour }: HorizontalLineProps) => {
  const { getGraphColumnColour } = useTheme()

  const style = useMemo<CSSProperties>(() => {
    // Furthest-right active branch takes precedence
    const furtherRightMergeNodeColumnIndex = state?.mergeSourceColumns
      ? Math.max(...state?.mergeSourceColumns ?? [])
      : undefined
    
    const borderColour = state.isPlaceholderSkeleton
      ? columnColour
      : getGraphColumnColour(furtherRightMergeNodeColumnIndex ?? commitNodeIndex)

    // Border is dotted for the skeleton placeholder elements.
    const borderStyle = state.isPlaceholderSkeleton ? 'dotted' : 'solid'

    // If this column has a node and is being merged into from another,
    // then we don't need to draw to the left of the node, just connect
    // to the right side horizontal line.
    if (state.isNode && state.mergeSourceColumns) {
      return {
        borderTop: `2px ${borderStyle} ${borderColour}`,
        width: '50%',
        right: 0,
        zIndex: columnIndex + 1
      }
    }

    // If no other conditions are met then we can draw a
    // full-width horizontal line.
    return {
      borderTop: `2px ${borderStyle} ${borderColour}`,
      width: columnIndex === 0 ? '50%' : '100%',
      zIndex: columnIndex + 1
    }
  }, [columnColour, commitNodeIndex, getGraphColumnColour, columnIndex, state.isNode, state.isPlaceholderSkeleton, state.mergeSourceColumns])


  return (
    <div
      style={style}
      className={classNames(styles.line, styles.horizontal)}
    />
  )
}