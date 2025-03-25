import { CSSProperties } from 'react'

/**
 * The number of pixels that the header
 * row needs to be so that the first
 * data row lines up with the first row
 * on the graph. Assuming 0 row spacing.
 */
export const HEADER_ROW_HEIGHT = 47

/**
 * The number of pixels of margin at the
 * top of the table element that offsets
 * it enough to line-up correctly with
 * the graph
 */
export const TABLE_MARGIN_TOP = 12

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