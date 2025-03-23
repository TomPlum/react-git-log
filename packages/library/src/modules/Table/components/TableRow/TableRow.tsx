import styles from './TableRow.module.scss'
import classNames from 'classnames'
import { GitLogTableRowProps } from './types'
import { useCallback, useMemo } from 'react'
import { useTheme } from 'hooks/useTheme'
import { useGitContext } from 'context/GitContext'
import { useSelectCommit } from 'hooks/useSelectCommit'
import dayjs from 'dayjs'
import { ROW_HEIGHT } from 'constants/constants'

export const TableRow = ({ index, commit, isPlaceholder, ...props }: GitLogTableRowProps) => {
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
    classes
  } = useGitContext()

  const isMergeCommit = commit.parents.length > 1

  const { selectCommitHandler } = useSelectCommit()
  
  const backgroundStyles = useMemo(() => {
    const colour = getCommitColour(commit)

    if (selectedCommit?.hash === commit.hash) {
      if (isPlaceholder) {
        return {
          background: hoverColour
        }
      }

      return {
        background: reduceOpacity(colour, 0.15)
      }
    }

    if (previewedCommit?.hash === commit.hash) {
      if (isPlaceholder) {
        return {
          background: hoverColour
        }
      }

      return {
        background: hoverColour
      }
    }

    return {
      background: 'transparent'
    }
  }, [isPlaceholder, getCommitColour, commit, selectedCommit?.hash, previewedCommit?.hash, reduceOpacity, hoverColour])

  const formatTimestamp = useCallback((dateString: string) => {
    const commitDate = dayjs(dateString)

    if (dayjs(new Date()).diff(commitDate, 'week') >= 1) {
      return commitDate.format(timestampFormat)
    }

    return commitDate.fromNow()
  }, [timestampFormat])

  const shouldReduceOpacity = !isPlaceholder && (isMergeCommit || commit.hash === 'index')

  const tableDataStyle = {
    lineHeight: `${ROW_HEIGHT}px`,
    color: shiftAlphaChannel(textColour, shouldReduceOpacity ? 0.4 : 1)
  }

  return (
    <div
      {...props}
      key={commit.hash}
      className={styles.row}
      style={classes?.tableStyles?.tr}
      id={`react-git-log-table-row-${index}`}
      onMouseOut={selectCommitHandler.onMouseOut}
      data-testid={`react-git-log-table-row-${index}`}
      onClick={() => selectCommitHandler.onClick(commit)}
      onMouseOver={() => selectCommitHandler.onMouseOver(commit)}
    >
      <div
        title={commit.message}
        className={classNames(styles.td, styles.message)}
        id={`react-git-log-table-data-commit-message-${index}`}
        data-testid={`react-git-log-table-data-commit-message-${index}`}
        style={{ ...tableDataStyle, ...backgroundStyles, ...classes?.tableStyles?.td }}
      >
        {commit.message}
      </div>

      <div
        className={classNames(styles.td, styles.date)}
        id={`react-git-log-table-data-timestamp-${index}`}
        data-testid={`react-git-log-table-data-timestamp-${index}`}
        style={{ ...tableDataStyle, ...backgroundStyles, ...classes?.tableStyles?.td }}>
        {commit.hash === 'index' || isPlaceholder ? '-' : formatTimestamp(commit.committerDate)}
      </div>
    </div>
  )
}