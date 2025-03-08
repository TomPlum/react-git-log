import type { Meta, StoryObj } from '@storybook/react'

import { GitGraph, GitGraphProps } from 'modules/Visualiser/components/GitGraph'

const meta = {
  title: 'Git Log/Visualiser',
  component: GitGraph,
  parameters: {
    layout: 'fullscreen',
  }
} satisfies Meta<GitGraphProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {}