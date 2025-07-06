import { CSSProperties, useCallback, useMemo } from 'react'
import { Within } from '@theme-toggles/react'
import { useDemoContext } from '@context'
import styles from './ThemeToggle.module.scss'

/**
 * From https://toggles.dev/within
 */
export const ThemeToggle = () => {
  const { theme, setTheme } = useDemoContext()

  const handleChange = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  const backgroundColour = theme === 'dark' ? 'rgb(68,68,68)' : 'rgb(218,218,218)'

  const style = useMemo<CSSProperties>(() => ({
    background: backgroundColour,
  }), [backgroundColour])

  return (
    <div className={styles.Wrapper} style={style}>
      {/* @ts-expect-error Bad typing in library */}
      <Within
        duration={750}
        onToggle={handleChange}
        toggled={theme === 'dark'}
        style={{
          color: theme === 'dark' ? 'white' : 'black',
          fontSize: '2.3em',
          display: 'flex',
          alignItems: 'center',
          padding: 0
        }}
      />
    </div>
  )
}