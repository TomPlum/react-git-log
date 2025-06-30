import styles from './StoryHeader.module.scss'
import { RepositorySelector } from '@components/RepositorySelector'
import { ColourSelector } from '@components/ColourSelector'
import { ThemeToggle } from '@components/ThemeToggle'
import { PackageInfo } from '@components/PackageInfo'
import { StoryHeaderProps } from '@components/StoryHeader/types'
import { PropsWithChildren } from 'react'
import { SearchField } from '@components/SearchField'
import { useDemoContext } from '@context'

export const StoryHeader = ({ children, repository, colours, onChangeColours, onChangeRepository }: PropsWithChildren<StoryHeaderProps>) => {
  const { theme } = useDemoContext()
  
  return (
    <div
      className={styles.header}
      style={{
        borderBottom: `1px solid ${theme === 'dark' ? 'rgb(112,112,112)' : 'rgb(42,42,42)'}`
      }}
    >
      <div className={styles.top}>
        <div className={styles.controls}>
          <div className={styles.controlsTop}>
            <RepositorySelector
              selected={repository}
              onSelect={onChangeRepository}
            />

            <ColourSelector
              selected={colours.id}
              onChange={onChangeColours}
            />

            <ThemeToggle />
          </div>

          <SearchField />
        </div>

        <PackageInfo theme={theme} />
      </div>

      <div>
        {children}
      </div>
    </div>
  )
}