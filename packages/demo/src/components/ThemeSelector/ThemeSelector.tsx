import { ThemeSelectorProps } from './types'
import { ChangeEvent, useCallback } from 'react'
import { neonAuroraDarkColours, neonAuroraLightColours, rainbowDarkColours, rainbowLightColours } from 'themes'

const getTheme = (name: string) => {
  switch (name) {
    case 'rainbow-dark': {
      return rainbowDarkColours
    }
    case 'rainbow-light': {
      return rainbowLightColours
    }
    case 'neon-aurora-dark': {
      return neonAuroraDarkColours
    }
    case 'neon-aurora-light': {
      return neonAuroraLightColours
    }
    default: {
      return []
    }
  }
}

export const ThemeSelector = ({ onChange }: ThemeSelectorProps) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    onChange(getTheme(e.target.value))
  }, [onChange])

  return (
    <select onChange={handleChange}>
      <option value='rainbow-dark'>
        rainbow-dark
      </option>
      <option value='rainbow-light'>
        rainbow-light
      </option>
      <option value='neon-aurora-dark'>
        neon-aurora-dark
      </option>
      <option value='neon-aurora-light'>
        neon-aurora-light
      </option>
    </select>
  )
}