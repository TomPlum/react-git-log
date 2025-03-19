import { ThemeToggleProps } from './types'
import { useCallback } from 'react'
import { Within } from '@theme-toggles/react'

/**
 * From https://toggles.dev/within
 */
export const ThemeToggle = ({ theme, onChange }: ThemeToggleProps) => {

  const handleChange = useCallback(() => {
    onChange(theme === 'dark' ? 'light' : 'dark')
  }, [onChange, theme])

  return (
    // @ts-expect-error Bad typing in library
    <Within
      duration={750}
      onToggle={handleChange}
      toggled={theme === 'dark'}
      style={{
        color: theme === 'dark' ? 'white' : 'black',
        fontSize: '2.3em',
        display: 'flex',
        alignItems: 'center',
        margin: '0 0 2px 0',
        padding: 0
      }}
    />
  )
}