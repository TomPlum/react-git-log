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
    case 'ring': {
      return (
        <div
          style={{ ...commonStyles, ...style?.ring }}
          data-testid={`graph-break-point-ring-${position}`}
          className={classNames(
            classes.Ring,
            classes[`Ring--${position}`],
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
    case 'line': {
      return (
        <div
          style={{ ...commonStyles, ...style?.['line'] }}
          data-testid={`graph-break-point-line-${position}`}
          className={classNames(
            classes.Line,
            classes[`Line--${position}`],
            className
          )}
        />
      )
    }
    case 'double-line': {
      return (
        <div
          style={{ ...commonStyles, ...style?.['double-line'] }}
          data-testid={`graph-break-point-double-line-${position}`}
          className={classNames(
            classes.DoubleLine,
            classes[`DoubleLine--${position}`],
            className
          )}
        />
      )
    }
    case 'arrow': {
      return (
        <div
          style={{ ...commonStyles, ...style?.arrow }}
          data-testid={`graph-break-point-arrow-${position}`}
          className={classNames(
            classes.Arrow,
            classes[`Arrow--${position}`],
            className
          )}
        />
      )
    }
  }
}