import styles from './SearchField.module.scss'
import { ChangeEvent, CSSProperties, useMemo } from 'react'
import { useDemoContext } from '@context'

export const SearchField = () => {
  const { search, setSearch, theme } = useDemoContext()

  const handleChange= (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const style = useMemo<CSSProperties>(() => ({
    background: theme === 'dark' ? '' : ''
  }), [theme])

  return (
    <input
      style={style}
      value={search ?? ''}
      onChange={handleChange}
      className={styles.SearchField}
    />
  )
}