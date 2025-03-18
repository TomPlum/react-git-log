import type { Meta, StoryObj } from '@storybook/react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'
import { Commit, GitLogEntry, GitLogVisualiserProps } from './types'
import { GitLogVisualiser } from './GitLogVisualiser'
import dayjs from 'dayjs'
import styles from './GitLogVisualiser.stories.module.scss'

const branches: Record<string, string> = {
  'TomPlum/sleep': 'release',
  'TomPlum/learn-japanese': 'feature/JPUI-51'
}

const fetchEntries = async (name: string): Promise<GitLogEntry[]> => {
  const response = await fetch(`/${name.split('/')[1]}.txt`)
  return parseGitLogOutput(await response.text())
}

interface StoryProps extends GitLogVisualiserProps {
  pageSize?: number
  page?: number
  repository: string
}

const meta: Meta<StoryProps> = {
  title: 'Git Log/GitLogVisualiser',
  component: GitLogVisualiser,
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
    theme: 'dark',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    enableExperimentalAnimation: false,
    githubRepositoryUrl: 'https://github.com/TomPlum/sleep',
    defaultGraphContainerWidth: 300,
    rowSpacing: 0
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['light', 'dark']
    },
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

    if (loading || !entries) {
      return <div>Loading...</div>
    }

    const backgroundColour = args.theme === 'dark' ? '#1a1a1a' : 'white'

    return (
      <div style={{ background: backgroundColour }} className={styles.container}>
        <select onChange={handleChangeRepository}>
          <option value='TomPlum/sleep'>
            TomPlum/sleep
          </option>
          <option value='TomPlum/learn-japanese'>
            TomPlum/learn-japanese
          </option>
        </select>

        <GitLogVisualiser
          {...args}
          entries={entries}
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