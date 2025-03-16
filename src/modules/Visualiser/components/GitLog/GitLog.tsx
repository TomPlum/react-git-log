import styles from './GitLog.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Commit } from 'modules/Visualiser'
import { useTheme } from 'hooks/useTheme'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useGitContext } from 'context'
import { usePlaceholderData } from 'modules/Graph/hooks/usePlaceholderData'
import { GitLogTableRow } from 'modules/Visualiser/components/GitLogTableRow'

dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)



export const GitLog = () => {
  const { textColour, } = useTheme()

  const {
    showTableHeaders,
    classes,
    graphData,
    paging,
    indexCommit
  } = useGitContext()

  const { placeholderData } = usePlaceholderData()

  const logData = useMemo<Commit[]>(() => {
    const data = graphData.commits.slice(paging.startIndex, paging.endIndex)

    if (paging.isIndexVisible) {
      data.unshift(indexCommit)
    }

    if (data.length === 0) {
      return placeholderData.map(({ commit }) => commit)
    }

    return data
  }, [graphData.commits, indexCommit, paging.endIndex, paging.isIndexVisible, paging.startIndex, placeholderData])

  return (
    <table
      style={classes?.logTableStyles?.table}
      className={classNames(styles.table, classes?.logTableClass)}
    >
      {showTableHeaders && (
        <thead style={classes?.logTableStyles?.thead}>
          <tr style={classes?.logTableStyles?.tr}>
            <th style={{ color: textColour }}>
              Commit message
            </th>
            <th style={{ color: textColour }}>
              Timestamp
            </th>
            <th />
          </tr>
        </thead>
      )}

      <tbody>
        {logData.map((commit) => (
          <GitLogTableRow commit={commit} />
        ))}
      </tbody>
    </table>
  )
}