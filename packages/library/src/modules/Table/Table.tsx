import styles from './Table.module.scss'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Commit } from 'types/Commit'
import { useTheme } from 'hooks/useTheme'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useGitContext } from 'context/GitContext'
import { usePlaceholderData } from 'modules/Graph/strategies/Grid/hooks/usePlaceholderData'
import { TableRow } from 'modules/Table/components/TableRow'
import { TableContainer } from 'modules/Table/components/TableContainer'
import { TableProps } from './types'
import { TableContext, TableContextBag } from './context'

dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

export const Table = ({
  row,
  className,
  styles: styleOverrides,
  timestampFormat = 'YYYY-MM-DD HH:mm:ss'
}: TableProps) => {
  const { textColour, } = useTheme()
  const { placeholderData } = usePlaceholderData()
  const { showHeaders, graphData, paging, indexCommit, isIndexVisible } = useGitContext()

  const tableData = useMemo<Commit[]>(() => {
    const data = graphData.commits.slice(paging?.startIndex, paging?.endIndex)

    if (isIndexVisible && indexCommit) {
      data.unshift(indexCommit)
    }

    return data
  }, [graphData.commits, indexCommit, paging?.endIndex, isIndexVisible, paging?.startIndex])

  const tableContextValue = useMemo<TableContextBag>(() => ({
    timestampFormat
  }), [timestampFormat])

  return (
    <TableContext value={tableContextValue}>
      <TableContainer
        row={row}
        className={className}
        rowQuantity={tableData.length}
        styleOverrides={styleOverrides?.table}
      >
        {showHeaders && (
          <div
            className={styles.head}
            id='react-git-log-table-head'
            style={styleOverrides?.thead}
            data-testid='react-git-log-table-head'
          >
            <div
              className={styles.header}
              style={{ color: textColour }}
              id='react-git-log-table-header-commit-message'
              data-testid='react-git-log-table-header-commit-message'
            >
              Commit message
            </div>

            <div
              className={styles.header}
              style={{ color: textColour }}
              id='react-git-log-table-header-author'
              data-testid='react-git-log-table-header-author'
            >
              Author
            </div>

            <div
              className={styles.header}
              style={{ color: textColour }}
              id='react-git-log-table-header-timestamp'
              data-testid='react-git-log-table-header-timestamp'
            >
              Timestamp
            </div>
          </div>
        )}

        {tableData.length == 0 && placeholderData.map(({ commit }, i) => (
          <TableRow
            index={i}
            isPlaceholder
            commit={commit}
            rowStyleOverrides={styleOverrides?.tr}
            dataStyleOverrides={styleOverrides?.td}
            key={`git-log-empty-table-row-${commit.hash}`}
            data-testid={`react-git-log-empty-table-row-${i}`}
          />
        ))}

        {tableData.map((commit, i) => (
          <TableRow
            row={row}
            index={i}
            commit={commit}
            rowStyleOverrides={styleOverrides?.tr}
            dataStyleOverrides={styleOverrides?.td}
            key={`git-log-table-row-${commit.hash}`}
            data-testid={`react-git-log-table-row-${i}`}
          />
        ))}
      </TableContainer>
    </TableContext>
  )
}