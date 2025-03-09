import styles from './GitLog.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { GitLogProps } from './types'
import { useCallback } from 'react'
import { Commit } from 'modules/Visualiser'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { useGitContext } from 'modules/Visualiser/context'

dayjs.extend(advancedFormat)

export const GitLog = ({ data }: GitLogProps) => {
  const { hoverColour, textColour, reduceOpacity } = useTheme()

  const {
    colours,
    selectedCommit,
    previewedCommit,
    timestampFormat,
    setSelectedCommit ,
    setPreviewedCommit
  } = useGitContext()

  const getStyles = useCallback((commit: Commit) => {
    const colour = colours[commit.x] ?? textColour

    if (selectedCommit?.hash === commit.hash) {
      return {
        color: textColour,
        background: `rgba(${colour?.replace('rgb(', '').replace(')', '')}, 0.15)`
      }
    }

    if (previewedCommit?.hash === commit.hash) {
      return {
        color: textColour,
        background: hoverColour
      }
    }

    return {
      color: textColour,
      background: 'transparent'
    }
  }, [colours, hoverColour, previewedCommit?.hash, reduceOpacity, selectedCommit?.hash, textColour])

  const handleMouseOver = useCallback((commit: Commit) => {
    setPreviewedCommit(commit)
  }, [setPreviewedCommit])

  const handleMouseOut = useCallback(() => {
    setPreviewedCommit(undefined)
  }, [setPreviewedCommit])

  const handleClickRow = useCallback((commit: Commit) => {
    if (selectedCommit) {
      setSelectedCommit(undefined)
    } else {
      setSelectedCommit(commit)
    }
  }, [selectedCommit, setSelectedCommit])

  return (
    <table className={styles.table}>
      <tbody>
        {data.map((commit) => {
          const tableDataStyle = getStyles(commit)

          return (
            <tr
              key={commit.hash}
              className={styles.row}
              style={{ height: 40 }}
              onMouseOut={handleMouseOut}
              onClick={() => handleClickRow(commit)}
              onMouseOver={() => handleMouseOver(commit)}
            >
              <td
                style={tableDataStyle}
                className={classNames(styles.td, styles.message)}
              >
                {commit.message}
              </td>

              <td className={classNames(styles.td, styles.date)} style={tableDataStyle}>
                {dayjs(commit.date).format(timestampFormat)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}