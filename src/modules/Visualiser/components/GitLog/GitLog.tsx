import styles from './GitLog.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { GitLogProps } from './types'
import { useCallback } from 'react'
import { Commit } from 'modules/Visualiser'

export const GitLog = ({ data, selected, hovered, onSelect, onHover, colour }: GitLogProps) => {
  const getStyles = useCallback((hash: string) => {
    if (selected === hash) {
      return {
        background: `rgba(${colour?.replace('rgb(', '').replace(')', '')}, 0.15)`
      }
    }

    if (hovered === hash) {
      return {
        background: 'rgba(231, 231, 231, 0.5)'
      }
    }

    return {
      background: 'transparent'
    }
  }, [colour, hovered, selected])

  const handleMouseOver = useCallback((commit: Commit) => {
    onHover(commit)
  }, [onHover])

  const handleMouseOut = useCallback(() => {
    onHover(undefined)
  }, [onHover])

  return (
    <table className={styles.table}>
      <tbody>
        {data.map((commit) => {
          const tableDataStyle = getStyles(commit.hash)

          return (
            <tr
              key={commit.hash}
              className={styles.row}
              style={{ height: 40 }}
              onMouseOut={handleMouseOut}
              onClick={() => onSelect(commit)}
              onMouseOver={() => handleMouseOver(commit)}
            >
              <td className={classNames(styles.td, styles.message)} style={tableDataStyle}>
                {commit.message}
              </td>

              <td className={classNames(styles.td, styles.date)} style={tableDataStyle}>
                {dayjs(commit.date).format('ddd Do MMM YYYY HH:mm')}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}