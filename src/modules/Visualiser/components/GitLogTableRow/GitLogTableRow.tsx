import styles from './GitLogTableRow.module.scss'
import classNames from 'classnames'
import { FadingDiv } from 'components/FadingDiv'
import { GitLogTableRowProps } from './types'
import { useCallback } from 'react'
import { Commit } from 'modules/Visualiser'
import { useTheme } from 'hooks/useTheme'
import { useGitContext } from 'context'
import { useSelectCommit } from 'hooks/useSelectCommit'
import dayjs from 'dayjs'

// TODO: Make dynamic
const ROW_HEIGHT = 40

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

  const isMergeCommit = commit.parents.length > 1

  const tableDataStyle = {
    opacity: commit.hash === 'index' || isPlaceholder ? 0.2 : 1,
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
        {commit.hash === 'index' || isPlaceholder ? '-' : formatTimestamp(commit.committerDate)}
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
}