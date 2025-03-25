export interface TableContextBag {
  /**
   * A timestamp format string passed to DayJS
   * to format the timestamps of the commits
   * in the log table.
   *
   * @default ISO-8601
   */
  timestampFormat?: string
}