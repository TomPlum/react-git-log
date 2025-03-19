import { CustomSelect } from 'components/CustomSelect'
import { RepositorySelectorProps } from './types'
import { RepositoryItem } from 'components/RepositoryItem'
import styles from './RepositorySelector.module.scss'

export const RepositorySelector = ({ selected, onSelect }: RepositorySelectorProps) => {
  return (
    <CustomSelect
      value={selected}
      className={styles.anchor}
      onChange={onSelect}
      options={[
        {
          value: 'TomPlum/sleep',
          label: (
            <RepositoryItem
              icon={<div />}
              name='TomPlum/sleep'
            />
          )
        },
        {
          value: 'TomPlum/learn-japanese',
          label: (
            <RepositoryItem
              icon={<div />}
              name='TomPlum/learn-japanese'
            />
          )
        }
      ]}
    />
  )
}