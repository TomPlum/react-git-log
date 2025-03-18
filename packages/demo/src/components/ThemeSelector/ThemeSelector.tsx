import { ThemeSelectorProps } from './types'
import { ChangeEvent, useCallback } from 'react'

export const ThemeSelector = ({ onChange }: ThemeSelectorProps) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
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