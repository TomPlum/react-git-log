import type { Meta, StoryObj } from '@storybook/react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import styles from './GitLog.stories.module.scss'
import GitHubLogo from 'assets/github-mark.svg?react'
import {
  type ThemeMode,
  type Commit,
  type GitLogEntry,
  type GitLogProps,
  GitLog
} from '@tomplum/react-git-log'
import { ColourSelection, ColourSelector } from 'components/ColourSelector'
import { fetchLogEntryData } from 'utils/fetchLogEntryData'
import { ThemeToggle } from 'components/ThemeToggle'
import { rainbow } from 'themes.ts'

// TODO: once mono repo in place, extract types and components from here

const branches: Record<string, string> = {
  'TomPlum/sleep': 'release',
  'TomPlum/learn-japanese': 'feature/JPUI-51'
}

interface StoryProps extends GitLogProps {
  pageSize?: number
  page?: number
  repository: string
}

const meta: Meta<StoryProps> = {
  title: 'GitLog',
  component: GitLog,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    showGitLog: true,
    showBranchesTags: true,
    showCommitNodeHashes: false,
    showCommitNodeTooltips: false,
    showTableHeaders: true,
    enableResize: false,
    entries: [],
    currentBranch: 'release',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    enableExperimentalAnimation: false,
    githubRepositoryUrl: 'https://github.com/TomPlum/sleep',
    defaultGraphContainerWidth: 200,
    rowSpacing: 0
  },
  argTypes: {
    pageSize: {
      control :{
        type: 'range',
        min: 1,
        max: 100
      }
    },
    page: {
      control :{
        type: 'range',
        min: 0,
        max: 50
      }
    },
    rowSpacing: {
      control :{
        type: 'range',
        min: 0,
        max: 50
      }
    },
    defaultGraphContainerWidth: {
      control: {
        type: 'range',
        min: 200,
        max: 500
      }
    }
  }
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [loading, setLoading] = useState(true)
    const [branch, setBranch] = useState('release')
    const [entries, setEntries] = useState<GitLogEntry[]>()
    const [theme, setTheme] = useState<ThemeMode>('dark')
    const [colours, setColours] = useState<ColourSelection>({ id: 'rainbow', colors: rainbow })

    const getData = useCallback(async (repository: string) => {
      return fetchLogEntryData(repository)
    }, [])

    useEffect(() => {
      setLoading(true)

      getData('TomPlum/sleep').then((data) => {
        setEntries(data)
      }).finally(() => {
        setLoading(false)
      })
    }, [getData])

    const handleChangeRepository = useCallback(async (e: ChangeEvent<HTMLSelectElement>) => {
      const newRepositoryName = e.target.value
      const newEntries = await getData(newRepositoryName)

      setEntries(newEntries)
      setBranch(branches[newRepositoryName])
    }, [getData])

    const handleChangeColors = useCallback((selected: ColourSelection) => {
      setColours(selected)
    }, [])

    if (loading || !entries) {
      return <div>Loading...</div>
    }

    const backgroundColour = theme === 'dark' ? '#1a1a1a' : 'white'
    const textColour = theme === 'dark' ? 'white' : '#1a1a1a'

    return (
      <div style={{ background: backgroundColour }} className={styles.container}>
        <div className={styles.header}>
          <div className={styles.controls}>
            <select onChange={handleChangeRepository}>
              <option value='TomPlum/sleep'>
                TomPlum/sleep
              </option>
              <option value='TomPlum/learn-japanese'>
                TomPlum/learn-japanese
              </option>
            </select>

            <ColourSelector
              selected={colours.id}
              onChange={handleChangeColors}
            />

            <ThemeToggle
              theme={theme}
              onChange={setTheme}
            />
          </div>

         <div className={styles.info}>
           <GitHubLogo
             className={styles.github}
             style={{ fill: textColour }}
           />

           <a href='https://github.com/TomPlum/react-git-log' className={styles.link}>
             react-git-log
           </a>

           <span style={{ color: textColour }} className={styles.by}>
             by
           </span>

           <a href='https://github.com/TomPlum' className={styles.link}>
             TomPlum
           </a>
         </div>
        </div>

        <GitLog
          {...args}
          colours={colours.colors}
          entries={entries}
          theme={theme}
          currentBranch={branch}
          paging={{
            page: args.page ?? 0,
            size: args.pageSize ?? entries.length
          }}
          classes={{
            containerStyles: {
              background: backgroundColour
            },
            logTableClass: styles.table
          }}
        />
      </div>
    )
  }
}