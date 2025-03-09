import styles from './GitLog.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { GitLogProps } from './types'
import { useCallback } from 'react'
import { Commit } from 'modules/Visualiser'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'

export const GitLog = ({ data, selected, hovered, onSelect, onHover, colour }: GitLogProps) => {
  const { hoverColour, textColour } = useTheme()
  
  const getStyles = useCallback((hash: string) => {
    if (selected === hash) {
      return {
        color: textColour,
        background: `rgba(${colour?.replace('rgb(', '').replace(')', '')}, 0.15)`
      }
    }

    if (hovered === hash) {
      return {
        color: textColour,
        background: hoverColour
      }
    }

    return {
      color: textColour,
      background: 'transparent'
    }
  }, [colour, hoverColour, hovered, selected, textColour])

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