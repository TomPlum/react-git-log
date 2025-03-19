import type { Meta, StoryObj } from '@storybook/react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { parseGitLogOutput } from './utils/gitLogParser'
import dayjs from 'dayjs'
import styles from './GitLog.stories.module.scss'
import GitHubLogo from 'assets/github-mark.svg?react'
import {
  type ThemeColours,
  type ThemeMode,
  type Commit,
  type GitLogEntry,
  type GitLogProps,
  GitLog
} from '@tomplum/react-git-log'
import { ThemeSelector } from 'components/ThemeSelector'

// TODO: once mono repo in place, extract types and components from here

const branches: Record<string, string> = {
  'TomPlum/sleep': 'release',
  'TomPlum/learn-japanese': 'feature/JPUI-51'
}

const fetchEntries = async (name: string): Promise<GitLogEntry[]> => {
  const response = await fetch(`/${name.split('/')[1]}.txt`)
  return parseGitLogOutput(await response.text())
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
    const [colours, setColours] = useState<ThemeColours>('rainbow-dark')
    const [theme, setTheme] = useState<ThemeMode>('dark')

    const fetchLogEntryData = useCallback(async (repository: string) => {
      const data = await fetchEntries(repository)
      const headCommit = data[0]
      const today = dayjs(new Date())
      const daysSinceHeadCommit = Math.abs(dayjs(headCommit.committerDate).diff(today, 'days'))
      if (daysSinceHeadCommit > 1) {
        const shiftedData: GitLogEntry[] = data.map(entry => ({
          ...entry,
          committerDate: dayjs(entry.committerDate).add(daysSinceHeadCommit, 'days').format()
        }))

        return shiftedData
      } else {
        return data
      }
    }, [])

    useEffect(() => {
      setLoading(true)

      fetchLogEntryData('TomPlum/sleep').then((data) => {
        setEntries(data)
      }).finally(() => {
        setLoading(false)
      })
    }, [fetchLogEntryData])

    const handleChangeRepository = useCallback(async (e: ChangeEvent<HTMLSelectElement>) => {
      const newRepositoryName = e.target.value
      const newEntries = await fetchLogEntryData(newRepositoryName)

      setEntries(newEntries)
      setBranch(branches[newRepositoryName])
    }, [fetchLogEntryData])

    const handleChangeColors = useCallback((themeName: string) => {
      setTheme(themeName.split('-').reverse()[0] as ThemeMode)
      setColours(themeName as ThemeColours)
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

            <ThemeSelector onChange={handleChangeColors} />
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
          colours={colours}
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