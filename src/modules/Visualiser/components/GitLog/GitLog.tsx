import styles from './GitLog.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { GitLogProps } from './types'
import { useCallback } from 'react'
import { Commit } from 'modules/Visualiser'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useGitContext } from 'modules/Visualiser/context'
import { motion } from 'framer-motion'
import { useSelectCommit } from 'modules/Visualiser/hooks/useSelectCommit'

dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

const ROW_HEIGHT = 40

export const GitLog = ({ data }: GitLogProps) => {
  const {
    textColour,
    hoverColour,
    reduceOpacity,
    shiftAlphaChannel,
    hoverTransitionDuration
  } = useTheme()

  const {
    colours,
    selectedCommit,
    previewedCommit,
    timestampFormat,
  } = useGitContext()

  const { selectCommitHandler } = useSelectCommit()

  const getBackgroundStyles = useCallback((commit: Commit) => {
    const colour = colours[commit.x] ?? textColour

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
  }, [colours, textColour, selectedCommit?.hash, previewedCommit?.hash, reduceOpacity, hoverColour])

  const formatTimestamp = useCallback((dateString: string) => {
    const commitDate = dayjs(dateString)

    if (dayjs(new Date()).diff(commitDate, 'week') >= 1) {
      return commitDate.format(timestampFormat)
    }

    return commitDate.fromNow()
  }, [timestampFormat])

  return (
    <table className={styles.table}>
      <tbody>
        {data.map((commit) => {
          const isMergeCommit = commit.parents.length > 1
          const tableDataStyle = {
            color: shiftAlphaChannel(textColour, isMergeCommit ? 0.4 : 1)
          }

          return (
            <tr
              key={commit.hash}
              className={styles.row}
              style={{ height: ROW_HEIGHT }}
              onMouseOut={selectCommitHandler.onMouseOut}
              onClick={() => selectCommitHandler.onClick(commit)}
              onMouseOver={() => selectCommitHandler.onMouseOver(commit)}
            >
              <td
                colSpan={100}
                className={styles.background}
                style={getBackgroundStyles(commit)}
                data-testid={`git-log-table-row-background-${commit.hash}`}
              >
                <motion.div
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: hoverTransitionDuration }}
                />
              </td>

              <td
                style={tableDataStyle}
                className={classNames(styles.td, styles.message)}
              >
                {commit.message}
              </td>

              <td className={classNames(styles.td, styles.date)} style={tableDataStyle}>
                {formatTimestamp(commit.date)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}