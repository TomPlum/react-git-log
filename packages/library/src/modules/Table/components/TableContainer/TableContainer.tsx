import classNames from 'classnames'
import styles from './TableContainer.module.scss'
import { PropsWithChildren, useMemo } from 'react'
import { useGitContext } from 'context/GitContext'
import { placeholderCommits } from 'modules/Graph/hooks/usePlaceholderData/data'
import { ROW_HEIGHT } from 'constants/constants'
import { HEADER_ROW_HEIGHT, TABLE_MARGIN_TOP } from 'modules/Table/constants'
import { TableContainerProps } from 'modules/Table/components/TableContainer/types'

export const TableContainer = ({
  rowQuantity,
  children,
  className,
  styleOverrides
}: PropsWithChildren<TableContainerProps>) => {
  const { rowSpacing, showHeaders } = useGitContext()

  const gridTemplateRows = useMemo(() => {
    // If no commits are visible as we're showing
    // the placeholder data for the skeleton view,
    // then use that size, else just use the log data length.
    const commitsVisible = rowQuantity > 0
      ? rowQuantity
      : placeholderCommits.length

    // If the table headers are turned off, then we simply
    // repeat the same row height for all rows.
    if (!showHeaders) {
      return `repeat(${commitsVisible}, ${ROW_HEIGHT}px)`
    }

    // With no row spacing, the header row height lines
    // up with the first data row fine. But when the row
    // spacing is increased, we must subtract half of it
    // from the height of the first header row to counteract
    // the gap between the header and the first data row.
    const headerRowHeight = HEADER_ROW_HEIGHT - (rowSpacing / 2)

    // All other rows (with data) get a fixed height.
    const remainingRowsHeight = `repeat(${commitsVisible}, ${ROW_HEIGHT}px)`

    return `${headerRowHeight}px ${remainingRowsHeight}`
  }, [rowQuantity, rowSpacing, showHeaders])

  const marginTop = useMemo(() => {
    if (showHeaders) {
      return TABLE_MARGIN_TOP
    }

    return (rowSpacing / 2) + TABLE_MARGIN_TOP
  }, [rowSpacing, showHeaders])
  
  return (
    <div
      id='react-git-log-table'
      data-testid='react-git-log-table'
      style={{
        ...styleOverrides,
        marginTop,
        gridTemplateRows,
        rowGap: rowSpacing
      }}
      className={classNames(styles.tableContainer, className)}
    >
      {children}
    </div>
  )
}