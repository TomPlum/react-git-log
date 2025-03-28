import styles from './StoryHeader.module.scss'
import { RepositorySelector } from 'components/RepositorySelector'
import { ColourSelector } from 'components/ColourSelector'
import { ThemeToggle } from 'components/ThemeToggle'
import { PackageInfo } from 'components/PackageInfo'
import { StoryHeaderProps } from 'components/StoryHeader/types'

export const StoryHeader = ({ theme, repository, colours, onChangeColours, onChangeRepository, onChangeTheme }: StoryHeaderProps) => {
  return (
    <div
      className={styles.header}
      style={{
        borderBottom: `1px solid ${theme === 'dark' ? 'rgb(112,112,112)' : 'rgb(42,42,42)'}`
      }}
    >
      <div className={styles.controls}>
        <RepositorySelector
          theme={theme}
          selected={repository}
          onSelect={onChangeRepository}
        />

        <ColourSelector
          theme={theme}
          selected={colours.id}
          onChange={onChangeColours}
        />

        <ThemeToggle
          theme={theme}
          onChange={onChangeTheme}
        />
      </div>

      <PackageInfo theme={theme} />
    </div>
  )
}