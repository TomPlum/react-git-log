import styles from './TimestampData.module.scss'
import { TimestampDataProps } from './types'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useTableContext } from 'modules/Table/context'

export const TimestampData = ({ index, timestamp, isPlaceholder, style }: TimestampDataProps) => {
  const { timestampFormat } = useTableContext()

  const formattedTimestamp = useMemo(() => {
    const commitDate = dayjs(timestamp)

    if (dayjs(new Date()).diff(commitDate, 'week') >= 1) {
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