import styles from './GitLog.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import { Commit } from 'modules/Visualiser'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useGitContext } from 'context'
import { useSelectCommit } from 'modules/Visualiser/hooks/useSelectCommit'
import { FadingDiv } from 'components/FadingDiv'

dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

const ROW_HEIGHT = 40

export const GitLog = () => {
  const {
    textColour,
    hoverColour,
    reduceOpacity,
    getCommitColour,
    shiftAlphaChannel
  } = useTheme()

  const {
    selectedCommit,
    previewedCommit,
    timestampFormat,
    showTableHeaders,
    classes,
    graphData,
    paging,
    indexCommit
  } = useGitContext()

  const { selectCommitHandler } = useSelectCommit()

  const getBackgroundStyles = useCallback((commit: Commit) => {
    const colour = getCommitColour(commit)

    if (selectedCommit?.hash === commit.hash) {
      return {
        background: reduceOpacity(colour, 0.15)
      }
    }

    if (previewedCommit?.hash === commit.hash) {
      return {
        background: hoverColour
      }
    }

    return {
      background: 'transparent'
    }
  }, [getCommitColour, selectedCommit?.hash, previewedCommit?.hash, reduceOpacity, hoverColour])

  const formatTimestamp = useCallback((dateString: string) => {
    const commitDate = dayjs(dateString)

    if (dayjs(new Date()).diff(commitDate, 'week') >= 1) {
      return commitDate.format(timestampFormat)
    }

    return commitDate.fromNow()
  }, [timestampFormat])

  const logData = useMemo<Commit[]>(() => {
    const data = graphData.commits.slice(paging.startIndex, paging.endIndex)

    if (paging.startIndex === 0) {
      data.unshift(indexCommit)
    }

    return data
  }, [graphData.commits, indexCommit, paging.endIndex, paging.startIndex])

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
        {logData.map((commit) => {
          const isMergeCommit = commit.parents.length > 1
          const tableDataStyle = {
            opacity: commit.hash === 'index' ? 0.2 : 1,
            color: shiftAlphaChannel(textColour, isMergeCommit ? 0.4 : 1)
          }

          return (
            <tr
              key={commit.hash}
              className={styles.row}
              onMouseOut={selectCommitHandler.onMouseOut}
              onClick={() => selectCommitHandler.onClick(commit)}
              style={{ height: ROW_HEIGHT, ...classes?.logTableStyles?.tr }}
              onMouseOver={() => selectCommitHandler.onMouseOver(commit)}
            >
              <td
                style={tableDataStyle}
                title={commit.message}
                className={classNames(styles.td, styles.message)}
              >
                {commit.message}
              </td>

              <td className={classNames(styles.td, styles.date)} style={tableDataStyle}>
                {commit.hash === 'index' ? '-' : formatTimestamp(commit.committerDate)}
              </td>

              <td
                colSpan={100}
                className={styles.background}
                style={getBackgroundStyles(commit)}
                data-testid={`git-log-table-row-background-${commit.hash}`}
              >
                <FadingDiv />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}