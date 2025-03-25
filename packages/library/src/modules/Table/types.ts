import { CSSProperties } from 'react'

export interface TableProps {
  /**
   * A timestamp format string passed to DayJS
   * to format the timestamps of the commits
   * in the log table.
   *
   * @default ISO-8601
   */
  timestampFormat?: string

  /**
   * A class name passed to the tables
   * wrapping container element.
   */
  className?: string

  /**
   * A React CSS styling object passed to
   * the various elements of the table.
   */
  styles?: GitLogTableStylingProps
}

export interface GitLogTableStylingProps {
  /**
   * A React CSS styling object passed to
   * the container element of the table.
   */
  table?: CSSProperties

  /**
   * A React CSS styling object passed to
   * the wrapping element around the table
   * headers.
   */
  thead?: CSSProperties

  /**
   * A React CSS styling object passed to
   * each table row element.
   */
  tr?: CSSProperties

  /**
   * A React CSS styling object passed to
   * each table data element.
   */
  td?: CSSProperties
}