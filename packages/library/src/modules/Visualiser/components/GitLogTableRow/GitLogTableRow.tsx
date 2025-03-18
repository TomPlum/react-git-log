import styles from './GitLogTableRow.module.scss'
import classNames from 'classnames'
import { GitLogTableRowProps } from './types'
import { useCallback, useMemo } from 'react'
import { useTheme } from 'hooks/useTheme'
import { useGitContext } from 'context/GitContext'
import { useSelectCommit } from 'hooks/useSelectCommit'
import dayjs from 'dayjs'

export const GitLogTableRow = ({ commit, isPlaceholder }: GitLogTableRowProps) => {
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
      return {
        background: reduceOpacity(colour, 0.15)
      }
    }

    if (previewedCommit?.hash === commit.hash) {
      return {
        background: hoverColour,
      }
    }

    return {
      background: 'transparent'
    }
  }, [getCommitColour, commit, selectedCommit?.hash, previewedCommit?.hash, reduceOpacity, hoverColour])

  const formatTimestamp = useCallback((dateString: string) => {
    const commitDate = dayjs(dateString)

    if (dayjs(new Date()).diff(commitDate, 'week') >= 1) {
      return commitDate.format(timestampFormat)
    }

    return commitDate.fromNow()
  }, [timestampFormat])

  const tableDataStyle = {
    opacity: isPlaceholder ? 0.2 : 1,
    color: shiftAlphaChannel(textColour, isMergeCommit || commit.hash === 'index' ? 0.4 : 1)
  }

  return (
    <div
      key={commit.hash}
      className={styles.row}
      style={classes?.logTableStyles?.tr}
      onMouseOut={selectCommitHandler.onMouseOut}
      data-testid={`git-log-table-row-${commit.hash}`}
      onClick={() => selectCommitHandler.onClick(commit)}
      onMouseOver={() => selectCommitHandler.onMouseOver(commit)}
    >
      <div
        title={commit.message}
        style={{ ...tableDataStyle, ...backgroundStyles }}
        className={classNames(styles.td, styles.message)}
      >
        {commit.message}
      </div>

      <div
        className={classNames(styles.td, styles.date)}
        style={{ ...tableDataStyle, ...backgroundStyles }}>
        {commit.hash === 'index' || isPlaceholder ? '-' : formatTimestamp(commit.committerDate)}
      </div>
    </div>
  )
}