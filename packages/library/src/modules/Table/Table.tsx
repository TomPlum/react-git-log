import styles from './Table.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Commit } from 'modules/Visualiser'
import { useTheme } from 'hooks/useTheme'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useGitContext } from 'context/GitContext'
import { usePlaceholderData } from 'modules/Graph/hooks/usePlaceholderData'
import { TableRow } from 'modules/Table/components/TableRow'
import { ROW_HEIGHT } from 'constants/constants'
import { HEADER_ROW_HEIGHT } from 'modules/Table/types'

dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

export const Table = () => {
  const { textColour, } = useTheme()

  const {
    showTableHeaders,
    classes,
    graphData,
    paging,
    rowSpacing,
    indexCommit
  } = useGitContext()

  const { placeholderData } = usePlaceholderData()

  const logData = useMemo<Commit[]>(() => {
    const data = graphData.commits.slice(paging.startIndex, paging.endIndex)

    if (paging.isIndexVisible) {
      data.unshift(indexCommit)
    }

    return data
  }, [graphData.commits, indexCommit, paging.endIndex, paging.isIndexVisible, paging.startIndex])

  const gridTemplateRows = useMemo(() => {
    // With no row spacing, the header row height lines
    // up with the first data row fine. But when the row
    // spacing is increased, we must subtract half of it
    // from the height of the first header row to counteract
    // the gap between the header and the first data row.
    const headerRowHeight = HEADER_ROW_HEIGHT - (rowSpacing / 2)

    // All other rows (with data) get a fixed height.
    const remainingRowsHeight = `repeat(${logData.length}, ${ROW_HEIGHT}px)`

    return `${headerRowHeight}px ${remainingRowsHeight}`
  }, [logData.length, rowSpacing])

  return (
    <div
      style={{
        ...classes?.logTableStyles?.table,
        gridTemplateRows,
        rowGap: rowSpacing
      }}
      className={classNames(styles.table, classes?.logTableClass)}
    >
      {showTableHeaders && (
        <div style={classes?.logTableStyles?.tr} className={styles.row}>
          <div style={{ color: textColour }} className={styles.header}>
            Commit message
          </div>

          <div style={{ color: textColour }} className={styles.header}>
            Timestamp
          </div>
        </div>
      )}

      {logData.length == 0 && placeholderData.map(({ commit }, i) => (
        <TableRow
          isPlaceholder
          commit={commit}
          data-testid={`git-log-empty-table-row-${i}`}
          key={`git-log-empty-table-row-${commit.hash}`}
        />
      ))}

      {logData.map((commit, i) => (
        <TableRow
          commit={commit}
          data-testid={`git-log-table-row-${i}`}
          key={`git-log-table-row-${commit.hash}`}
        />
      ))}
    </div>
  )
}