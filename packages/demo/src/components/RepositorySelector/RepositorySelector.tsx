import { CustomSelect } from 'components/CustomSelect'
import { RepositorySelectorProps } from './types'
import { RepositoryItem } from 'components/RepositoryItem'
import JapaneseLantern from 'assets/lantern.svg?react'
import SleepIcon from 'assets/sleep.svg?react'
import StarIcon from 'assets/star.svg?react'
import styles from './RepositorySelector.module.scss'

export const RepositorySelector = ({ selected, onSelect, theme }: RepositorySelectorProps) => {
  return (
    <CustomSelect
      width={300}
      theme={theme}
      value={selected}
      className={styles.anchor}
      onChange={onSelect}
      options={[
        {
          value: 'TomPlum/sleep',
          label: (
            <RepositoryItem
              icon={<SleepIcon />}
              name='TomPlum/sleep'
            />
          )
        },
        {
          value: 'TomPlum/learn-japanese',
          label: (
            <RepositoryItem
              icon={<JapaneseLantern />}
              name='TomPlum/learn-japanese'
            />
          )
        },
        {
          value: 'TomPlum/advent-of-code-2019',
          label: (
            <RepositoryItem
              icon={<StarIcon style={{ stroke: theme === 'dark' ? 'rgb(245,230,57)' : 'rgb(255,246,40)' }} />}
              name='TomPlum/advent-of-code-2019'
            />
          )
        }
      ]}
    />
  )
}