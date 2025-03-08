import styles from './GitLog.module.scss'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { GitLogProps } from './types'

export const GitLog = ({ data }: GitLogProps) => {
  return (
    <table className={styles.table}>
      <tbody>
      {data.map((commit) => (
        <tr key={commit.hash}>
          <td className={classNames(styles.row, styles.hash)}>
            {commit.hash}
          </td>

          <td className={classNames(styles.row, styles.message)}>
            {commit.message}
          </td>

          <td className={classNames(styles.row, styles.date)}>
            {dayjs(commit.date).format('ddd Do MMM YYYY HH:mm')}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}