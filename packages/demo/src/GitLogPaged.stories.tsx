import type { Meta, StoryObj } from '@storybook/react-vite'
import { type Commit, GitLogPaged } from '@tomplum/react-git-log'
import { GitLogPagedDemo, GitLogPagedStoryProps } from '@components/GitLogPagedDemo'


const meta: Meta<GitLogPagedStoryProps> = {
  title: 'GitLogPaged',
  component: GitLogPaged,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    entries: [],
    showTable: true,
    branchName: 'release',
    showCommitNodeHashes: false,
    showHeaders: true,
    enableResize: false,
    nodeTheme: 'default',
    showGitIndex: true,
    renderStrategy: 'html-grid',
    nodeSize: 20,
    orientation: 'normal',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    defaultGraphWidth: 120,
    rowSpacing: 0,
  },
  argTypes: {
    entries: {
      name: 'Git Log Entries',
      table: {
        category: 'Required Props'
      }
    },
    branchName: {
      name: 'Branch Name',
      table: {
        category: 'Required Props'
      }
    },
    showCommitNodeHashes: {
      name: 'Show Commit Hashes',
      table: {
        category: 'Visibility'
      }
    },
    showTable: {
      name: 'Show Table',
      table: {
        category: 'Visibility'
      }
    },
    showHeaders: {
      name: 'Show Headers',
      type: 'boolean',
      table: {
        category: 'Visibility'
      }
    },
    nodeTheme: {
      name: 'Node Style',
      table: {
        category: 'Visibility'
      },
      control: 'radio',
      options: {
        Default: 'default',
        Plain: 'plain'
      }
    },
    showGitIndex: {
      name: 'Show Git Index',
      type: 'boolean',
      table: {
        category: 'Visibility'
      }
    },
    renderStrategy: {
      name: 'Graph Render Strategy',
      table: {
        category: 'Visibility'
      },
      control: 'radio',
      options: {
        'HTML Grid': 'html-grid',
        Canvas2D: 'canvas'
      }
    },
    enableResize: {
      name: 'Enable Resize',
      table: {
        category: 'Dimensions'
      }
    },
    rowSpacing: {
      name: 'Row Spacing',
      table: {
        category: 'Dimensions'
      },
      control: {
        type: 'range',
        min: 0,
        max: 50
      }
    },
    defaultGraphWidth: {
      name: 'Graph Width',
      table: {
        category: 'Dimensions'
      },
      control: {
        type: 'range',
        min: 0,
        max: 500
      }
    },
    nodeSize: {
      name: 'Graph Node Size',
      table: {
        category: 'Dimensions'
      },
      control: {
        type: 'range',
        min: 8,
        max: 30,
        step: 2
      }
    },
    orientation: {
      name: 'Graph Orientation',
      table: {
        category: 'Dimensions'
      },
      control: 'radio',
      options: {
        Normal: 'normal',
        Flipped: 'flipped'
      }
    },
    onSelectCommit: {
      name: 'onSelectCommit',
      table: {
        category: 'Callback Functions'
      }
    },

    // Hiding defaults that have custom props to drive them
    theme: {
      table: {
        disable: true
      }
    },
    colours: {
      table: {
        disable: true
      }
    },
    urls: {
      table: {
        disable: true
      }
    },
    classes: {
      table: {
        disable: true
      }
    },
    indexStatus: {
      table: {
        disable: true
      }
    },
    headCommitHash: {
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<GitLogPagedStoryProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  render: (args) => <GitLogPagedDemo {...args} />
}