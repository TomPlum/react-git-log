import { CSSProperties, ReactElement } from 'react'
import { Commit } from 'types/Commit'

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
   * Overrides the table row
   * with a custom implementation.
   *
   * Your custom row elements height
   * should be divisible by 2 so it
   * renders inline with the graph
   * nodes.
   *
   * Passing this in also causes the
   * table container to no longer use
   * a CSS Grid. This gives you the option
   * to use any styling yourself such as
   * flex-box.
   *
   * Some properties are injected into the
   * wrapping element of your custom row
   * element to ensure basic layout functions
   * as expected.
   */
  row?: CustomTableRow

  /**
   * A class name passed to the tables'
   * wrapping container element.
   */
  className?: string

  /**
   * A React CSS styling object passed to
   * the various elements of the table.
   */
  styles?: GitLogTableStylingProps
}

export type CustomTableRow = (props: CustomTableRowProps) => ReactElement<HTMLElement>

export interface CustomTableRowProps {
  /**
   * Details of the commit belonging
   * to this row.
   */
  commit: Commit

  /**
   * Whether the commit in this row
   * has been selected in the log.
   *
   * i.e. Has been clicked on.
   */
  selected: boolean

  /**
   * Whether the commit in this row
   * has been previewed in the log.
   *
   * i.e. Is being hovered over.
   */
  previewed: boolean

  /**
   * The colour of the background as is
   * normally applied to the table row.
   *
   * This colour changes based on whether
   * the row is previewed or selected
   * and on the chosen theme or array of
   * graph colours.
   */
  backgroundColour: string
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