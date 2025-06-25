import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeContextProvider } from './ThemeContextProvider'
import { ThemeContext } from 'context/ThemeContext/ThemeContext'
import * as useThemeModule from 'hooks/useTheme'
import * as generateRainbowGradient from 'hooks/useTheme/createRainbowTheme'
import { neonAuroraDarkColours, neonAuroraLightColours } from 'hooks/useTheme'
import { useContext } from 'react'
import { themeFunctions } from 'test/stubs'

const ContextConsumer = () => {
  const ctx = useContext(ThemeContext)
  return (
    <div>
      <div data-testid="theme">{ctx.theme}</div>
      <div data-testid="colours">{JSON.stringify(ctx.colours)}</div>
    </div>
  )
}

describe('ThemeContextProvider', () => {
  const mockShiftAlpha = vi.fn((colour: string, alpha: number) => `${colour}-alpha${alpha}`)

  beforeEach(() => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue(themeFunctions({
      shiftAlphaChannel: mockShiftAlpha,
    }))

    mockShiftAlpha.mockClear()
  })

  it('returns rainbow-light colours without alpha shift', () => {
    const rainbow = ['#f00', '#0f0', '#00f']
    vi.spyOn(generateRainbowGradient, 'generateRainbowGradient').mockReturnValue(rainbow)

    render(
      <ThemeContextProvider theme="light" colours="rainbow-light" graphWidth={2}>
        <ContextConsumer />
      </ThemeContextProvider>
    )

    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(screen.getByTestId('colours').textContent).toBe(JSON.stringify(rainbow))
    expect(mockShiftAlpha).not.toHaveBeenCalled()
  })

  it('returns rainbow-dark colours with alpha shift', () => {
    const rainbow = ['#f00', '#0f0', '#00f']
    vi.spyOn(generateRainbowGradient, 'generateRainbowGradient').mockReturnValue(rainbow)

    render(
      <ThemeContextProvider theme="dark" colours="rainbow-dark" graphWidth={2}>
        <ContextConsumer />
      </ThemeContextProvider>
    )

    const expected = rainbow.map(c => `${c}-alpha0.6`)
    expect(screen.getByTestId('colours').textContent).toBe(JSON.stringify(expected))
    expect(mockShiftAlpha).toHaveBeenCalledTimes(rainbow.length)
  })

  it('returns neon-aurora-dark palette', () => {
    render(
      <ThemeContextProvider theme="dark" colours="neon-aurora-dark" graphWidth={1}>
        <ContextConsumer />
      </ThemeContextProvider>
    )

    expect(screen.getByTestId('colours').textContent).toBe(JSON.stringify(neonAuroraDarkColours))
  })

  it('returns neon-aurora-light palette', () => {
    render(
      <ThemeContextProvider theme="light" colours="neon-aurora-light" graphWidth={1}>
        <ContextConsumer />
      </ThemeContextProvider>
    )

    expect(screen.getByTestId('colours').textContent).toBe(JSON.stringify(neonAuroraLightColours))
  })

  it('returns raw colours for light theme', () => {
    const inputColours = ['#abc', '#def']

    render(
      <ThemeContextProvider theme="light" colours={inputColours} graphWidth={1}>
        <ContextConsumer />
      </ThemeContextProvider>
    )

    expect(screen.getByTestId('colours').textContent).toBe(JSON.stringify(inputColours))
    expect(mockShiftAlpha).not.toHaveBeenCalled()
  })

  it('returns alpha-shifted colours for dark theme with custom palette', () => {
    const inputColours = ['#abc', '#def']

    render(
      <ThemeContextProvider theme="dark" colours={inputColours} graphWidth={1}>
        <ContextConsumer />
      </ThemeContextProvider>
    )

    expect(mockShiftAlpha).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId('colours').textContent).toBe(
      JSON.stringify(inputColours.map(c => `${c}-alpha0.6`))
    )
  })
})