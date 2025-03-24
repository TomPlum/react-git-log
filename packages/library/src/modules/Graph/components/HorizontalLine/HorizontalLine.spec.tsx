import { describe } from 'vitest'
import { render } from '@testing-library/react'
import { HorizontalLine } from 'modules/Graph/components/HorizontalLine/HorizontalLine'
import { graphColumn } from 'test/elements/GraphColumn'
import * as themeHook from 'hooks/useTheme'
import { ThemeFunctions } from 'hooks/useTheme'

const spyTheme = (stubs: Partial<ThemeFunctions>) => {
  return vi.spyOn(themeHook, 'useTheme').mockReturnValue({
    getGraphColumnColour: vi.fn(),
    shiftAlphaChannel: vi.fn(),
    hoverColour: 'hoverColour',
    theme: 'dark',
    textColour: 'textColour',
    reduceOpacity: vi.fn(),
    getCommitColour: vi.fn(),
    getTooltipBackground: vi.fn(),
    hoverTransitionDuration: 500,
    ...stubs
  })
}

describe('HorizontalLine', () => {
  it('should render a half-width line if the column is index 0', () => {
    const graphColumnColour = 'rgb(0, 5, 10)'
    const getGraphColumnColour = vi.fn().mockReturnValue(graphColumnColour)
    spyTheme({ getGraphColumnColour })

    const commitNodeIndex = 0

    render(
      <HorizontalLine
        state={{ }}
        columnIndex={0}
        columnColour={'rgb(12, 34, 56)'}
        commitNodeIndex={commitNodeIndex}
      />
    )

    expect(getGraphColumnColour).toHaveBeenCalledWith(commitNodeIndex)

    const line = graphColumn.withHalfWidthRightHorizontalLine()
    expect(line).toHaveAttribute('id', 'horizontal-line-right-half')

    const lineStyle = getComputedStyle(line)
    expect(lineStyle.width).toBe('50%')
    expect(lineStyle.borderTopWidth).toBe('2px')
    expect(lineStyle.borderTopStyle).toBe('solid')
    expect(lineStyle.borderTopColor).toBe(graphColumnColour)
    expect(lineStyle.zIndex).toBe('1')
  })

  it('should render a full-width line if the column is index is greater-than 0', () => {
    render(
      <HorizontalLine
        state={{ }}
        columnIndex={3}
        commitNodeIndex={0}
        columnColour={'rgb(12, 34, 56)'}
      />
    )

    const line = graphColumn.withFullWidthHorizontalLine()
    expect(line).toHaveAttribute('id', 'horizontal-line-full-width')

    const lineStyle = getComputedStyle(line)
    expect(lineStyle.width).toBe('100%')
  })

  it('should render the line with the column colour of the max merge node index if there is one', () => {
    const graphColumnColour = 'rgb(2, 1, 76)'
    const getGraphColumnColour = vi.fn().mockReturnValue(graphColumnColour)
    spyTheme({ getGraphColumnColour })

    render(
      <HorizontalLine
        columnIndex={0}
        commitNodeIndex={0}
        columnColour={'rgb(12, 34, 56)'}
        state={{ mergeSourceColumns: [2, 1, 6] }}
      />
    )

    // Even though we're in column 0, get the colour for
    // column 6 since it's the farther right in the merge source columns.
    expect(getGraphColumnColour).toHaveBeenCalledWith(6)

    const lineStyle = getComputedStyle(graphColumn.withHalfWidthRightHorizontalLine())
    expect(lineStyle.borderTopColor).toBe(graphColumnColour)
  })
})