import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'
import { Commit, GitLogEntry, GitLogVisualiserProps } from './types'
import { GitLogVisualiser } from './GitLogVisualiser'
import { lightThemeColors } from 'modules/Visualiser/hooks/useTheme'
import dayjs from 'dayjs'
import styles from './GitLogVisualiser.stories.module.scss'

const fetchEntries = async (): Promise<GitLogEntry[]> => {
  const response = await fetch('/git-log-all.txt')
  return parseGitLogOutput(await response.text())
}

const meta = {
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
    showTableHeaders: false,
    entries: [],
    currentBranch: 'release',
    colours: lightThemeColors,
    theme: 'light',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    enableExperimentalAnimation: false,
    githubRepositoryUrl: 'https://github.com/TomPlum/sleep',
    graphWidth: 400
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['light', 'dark']
    }
  }
} satisfies Meta<GitLogVisualiserProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [entries, setEntries] = useState<GitLogEntry[]>()

    useEffect(() => {
      fetchEntries()
        .then(data => {
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
      <div style={{ padding: 20, background: backgroundColour }}>
        <GitLogVisualiser
          {...args}
          entries={entries}
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