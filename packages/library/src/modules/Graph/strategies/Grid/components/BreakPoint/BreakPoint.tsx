import { BreakPointProps } from './types'
import classNames from 'classnames'
import classes from './BreakPoint.module.scss'
import { useGraphContext } from 'modules/Graph/context'
import { CSSProperties, useMemo } from 'react'

export const BreakPoint = ({ position, className, color, style }: BreakPointProps) => {
  const { breakPointTheme } = useGraphContext()

  const styles = useMemo<CSSProperties>(() => ({
    '--breakpoint-colour': color,
    ...style
  } as CSSProperties), [color, style])

  switch (breakPointTheme) {
    case 'slash': {
      return (
        <div
          style={styles}
          data-testid={`graph-break-point-slash-${position}`}
          className={classNames(
            classes.Slash,
            classes[`Slash--${position}`],
            className
          )}
        />
      )
    }
    case 'dot': {
      return (
        <div
          style={styles}
          data-testid={`graph-break-point-dot-${position}`}
          className={classNames(
            classes.Slash,
            classes[`Dot--${position}`],
            className
          )}
        />
      )
    }
    case 'zig-zag': {
      return (
        <div
          style={styles}
          data-testid={`graph-break-point-zig-zag-${position}`}
          className={classNames(
            classes.Slash,
            classes[`ZigZag--${position}`],
            className
          )}
        />
      )
    }
  }
}