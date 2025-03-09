import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'
import { GitLogEntry, GitLogVisualiserProps } from './types'
import { GitLogVisualiser } from './GitLogVisualiser'

const fetchEntries = async (): Promise<GitLogEntry[]> => {
  const response = await fetch('/git-log-all.txt')
  return parseGitLogOutput(await response.text())
}

const meta = {
  title: 'Git Log/GitLogVisualiser',
  component: GitLogVisualiser,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    showGitLog: true,
    showBranchesTags: true,
    showCommitNodeHashes: false,
    padding: {
      left: 10,
      top: 10
    },
    entries: []
  }
} satisfies Meta<GitLogVisualiserProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [entries, setEntries] = useState<GitLogEntry[]>()

    useEffect(() => {
      fetchEntries().then(setEntries)
    }, [])

    if (!entries) {
      return <div>Loading...</div>
    }

    return <GitLogVisualiser {...args} entries={entries} />
  }
}