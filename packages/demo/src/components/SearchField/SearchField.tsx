import styles from './SearchField.module.scss'
import { ChangeEvent, CSSProperties, useMemo } from 'react'
import { useDemoContext } from '@context'

export const SearchField = () => {
  const { search, setSearch, theme } = useDemoContext()

  const handleChange= (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const textColour = theme === 'dark' ? 'rgb(239,239,239)' : 'rgb(0,0,0)'
  const backgroundColour = theme === 'dark' ? 'rgb(68,68,68)' : 'rgb(218,218,218)'

  const style = useMemo<CSSProperties>(() => ({
    background: backgroundColour,
    color: textColour
  }), [backgroundColour, textColour])

  return (
    <input
      style={style}
      value={search ?? ''}
      onChange={handleChange}
      className={styles.SearchField}
      placeholder='Search to filter commits...'
    />
  )
}