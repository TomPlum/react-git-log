import styles from './TimestampData.module.scss'
import { TimestampDataProps } from './types'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTableContext } from 'modules/Table/context'

dayjs.extend(utc)
dayjs.extend(relativeTime)

export const TimestampData = ({ index, timestamp, isPlaceholder, style }: TimestampDataProps) => {
  const { timestampFormat } = useTableContext()

  const formattedTimestamp = useMemo(() => {
    const commitDate = dayjs.utc(timestamp)

    if (dayjs.utc().diff(commitDate, 'week') >= 1) {
      return commitDate.format(timestampFormat)
    }

    return commitDate.fromNow()
  }, [timestamp, timestampFormat])

  return (
    <div
      style={style}
      className={styles.timestamp}
      id={`react-git-log-table-data-timestamp-${index}`}
      data-testid={`react-git-log-table-data-timestamp-${index}`}
    >
      {isPlaceholder ? '-' : formattedTimestamp}
    </div>
  )
}