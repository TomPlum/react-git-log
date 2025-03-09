import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { GitLogEntry, GitLogVisualiser, GitLogVisualiserProps } from 'modules/Visualiser'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'

const fetchEntries = async (): Promise<GitLogEntry[]> => {
  const response = await fetch('/git-log-all.txt')
  return parseGitLogOutput(await response.text())
}

const meta = {
  title: 'Git Log/Visualiser',
  component: GitLogVisualiser,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    showGitLog: true,
    showBranchesTags: true
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