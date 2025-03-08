import type { Meta, StoryObj } from '@storybook/react'

import { GitLogVisualiser, GitLogVisualiserProps } from 'modules/Visualiser'

const meta = {
  title: 'Git Log/Visualiser',
  component: GitLogVisualiser,
  parameters: {
    layout: 'fullscreen',
  }
} satisfies Meta<GitLogVisualiserProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {}