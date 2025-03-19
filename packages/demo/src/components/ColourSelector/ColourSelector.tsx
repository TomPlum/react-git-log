import { ThemeSelectorProps } from './types'
import { ChangeEvent, useCallback } from 'react'
import { neonAurora, rainbow } from 'themes'

const getTheme = (name: string) => {
  switch (name) {
    case 'rainbow': {
      return rainbow
    }
    case 'neon-aurora': {
      return neonAurora
    }
    default: {
      return []
    }
  }
}

export const ColourSelector = ({ onChange }: ThemeSelectorProps) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    onChange(getTheme(e.target.value))
  }, [onChange])

  return (
    <select onChange={handleChange}>
      <option value='rainbow'>
        rainbow
      </option>
      <option value='neon-aurora'>
        neon-aurora
      </option>
    </select>
  )
}