import styles from './GitLog.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { GitLogProps } from './types'

export const GitLog = ({ data, selected, onSelect, colour }: GitLogProps) => {
  const getStyles = (hash: string) => ({
    background: selected === hash
      ? `rgba(${colour?.replace('rgb(', '').replace(')', '')}, 0.15)`
      : 'transparent'
  })

  return (
    <table className={styles.table}>
      <tbody>
        {data.map((commit) => (
          <tr
            key={commit.hash}
            className={styles.row}
            style={{ height: 40 }}
            onClick={() => onSelect(commit)}
          >
            <td className={classNames(styles.td, styles.message)} style={getStyles(commit.hash)}>
              {commit.message}
            </td>

            <td className={classNames(styles.td, styles.date)} style={getStyles(commit.hash)}>
              {dayjs(commit.date).format('ddd Do MMM YYYY HH:mm')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}