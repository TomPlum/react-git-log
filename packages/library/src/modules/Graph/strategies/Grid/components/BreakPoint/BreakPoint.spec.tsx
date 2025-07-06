import { render, screen } from '@testing-library/react'
import { BreakPoint } from './BreakPoint'
import * as graphContext from 'modules/Graph/context'
import { graphContextBag } from 'test/stubs'
import { BreakPointTheme } from 'hooks/useTheme'
import { BreakPointPosition } from './types'

describe('Filtered Graph Break Point', () => {
  const variations: { theme: BreakPointTheme, position: BreakPointPosition }[] = [
    {
      theme: 'dot',
      position: 'top'
    },
    {
      theme: 'dot',
      position: 'bottom'
    },
    {
      theme: 'slash',
      position: 'top'
    },
    {
      theme: 'slash',
      position: 'bottom'
    },
    {
      theme: 'zig-zag',
      position: 'top'
    },
    {
      theme: 'zig-zag',
      position: 'bottom'
    },
    {
      theme: 'line',
      position: 'top'
    },
    {
      theme: 'line',
      position: 'bottom'
    },
    {
      theme: 'double-line',
      position: 'top'
    },
    {
      theme: 'double-line',
      position: 'bottom'
    },
    {
      theme: 'ring',
      position: 'top'
    },
    {
      theme: 'ring',
      position: 'bottom'
    },
    {
      theme: 'arrow',
      position: 'top'
    },
    {
      theme: 'arrow',
      position: 'bottom'
    }
  ]

  variations.forEach(({ position, theme }) => {
    it(`should render a [${position}] break point correctly when the theme is [${theme}]`, () => {
      vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
        breakPointTheme: theme
      }))

      const { asFragment } = render(
        <BreakPoint
          position={position}
          color='rbg(125, 67, 100)'
        />
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Style Overriding', () => {
    variations.forEach(({ position, theme }) => {
      it('should spread styles props into the underlying element wrapper for the matching theme', () => {
        vi.spyOn(graphContext, 'useGraphContext').mockReturnValue(graphContextBag({
          breakPointTheme: theme
        }))

        render(
          <BreakPoint
            color='green'
            position={position}
            style={{
              [theme]: {
                borderColor: 'antiquewhite'
              }
            }}
          />
        )

        expect(screen.getByTestId(`graph-break-point-${theme}-${position}`)).toHaveStyle({
          borderColor: 'antiquewhite'
        })
      })
    })
  })
})