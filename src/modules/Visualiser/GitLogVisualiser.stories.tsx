import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'
import { Commit, GitLogEntry, GitLogVisualiserProps } from './types'
import { GitLogVisualiser } from './GitLogVisualiser'
import dayjs from 'dayjs'
import styles from './GitLogVisualiser.stories.module.scss'

const repositories: Record<string, string> = {
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
    entries: [],
    currentBranch: 'release',
    theme: 'dark',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    enableExperimentalAnimation: false,
    githubRepositoryUrl: 'https://github.com/TomPlum/sleep',
    graphWidth: 400,
    repository: 'TomPlum/sleep'
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['light', 'dark']
    },
    pageSize: {
      control: {
        type: 'number',
        min: 0
      }
    },
    page: {
      control: {
        type: 'number',
        min: 0
      }
    },
    repository: {
      options: ['TomPlum/sleep', 'TomPlum/learn-japanese'],
      control: {
        type: 'select',
      }
    }
  }
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [entries, setEntries] = useState<GitLogEntry[]>()

    useEffect(() => {
      fetchEntries(args.repository).then(data => {
        const headCommit = data[0]
        const today = dayjs(new Date())
        const daysSinceHeadCommit = Math.abs(dayjs(headCommit.committerDate).diff(today, 'days'))

        if (daysSinceHeadCommit > 1) {
          const shiftedData: GitLogEntry[] = data.map(entry => ({
            ...entry,
            committerDate: dayjs(entry.committerDate).add(daysSinceHeadCommit, 'days').format()
          }))

          setEntries(shiftedData)
        } else {
          setEntries(data)
        }
      })
    }, [])

    if (!entries) {
      return <div>Loading...</div>
    }

    const backgroundColour = args.theme === 'dark' ? '#1a1a1a' : 'white'

    return (
      <div style={{ background: backgroundColour }} className={styles.container}>
        <GitLogVisualiser
          {...args}
          entries={entries}
          paging={{
            page: args.page ?? 0,
            size: args.pageSize ?? entries.length
          }}
          currentBranch={repositories[args.repository]}
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