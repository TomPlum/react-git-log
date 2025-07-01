import { BreakPointProps } from './types'
import classNames from 'classnames'
import classes from './BreakPoint.module.scss'
import { useGraphContext } from 'modules/Graph/context'
import { CSSProperties, useMemo } from 'react'

export const BreakPoint = ({ position, className, color, style }: BreakPointProps) => {
  const { breakPointTheme } = useGraphContext()

  const commonStyles = useMemo<CSSProperties>(() => ({
    '--breakpoint-colour': color
  } as CSSProperties), [color])

  switch (breakPointTheme) {
    case 'slash': {
      return (
        <div
          style={{ ...commonStyles, ...style?.slash }}
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
          style={{ ...commonStyles, ...style?.dot }}
          data-testid={`graph-break-point-dot-${position}`}
          className={classNames(
            classes.Dot,
            classes[`Dot--${position}`],
            className
          )}
        />
      )
    }
    case 'zig-zag': {
      return (
        <div
          style={{ ...commonStyles, ...style?.['zig-zag'] }}
          data-testid={`graph-break-point-zig-zag-${position}`}
          className={classNames(
            classes.ZigZag,
            classes[`ZigZag--${position}`],
            className
          )}
        />
      )
    }
  }
}