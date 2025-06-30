import styles from './SearchField.module.scss'
import { SearchFieldProps } from './types'
import { ChangeEvent } from 'react'
import { useDemoContext } from '@context'

export const SearchField = ({ theme }: SearchFieldProps) => {
  const { search, setSearch } = useDemoContext()

  const handleChange= (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <input
      value={search ?? ''}
      className={styles.input}
      onChange={handleChange}
    />
  )
}