import type { Meta, StoryObj } from '@storybook/react'
import styles from './GitLog.stories.module.scss'
import { type Commit, GitLog, type GitLogProps, GraphProps } from '@tomplum/react-git-log'
import { Loading } from 'components/Loading'
import { useStoryState } from 'hooks/useStoryState'
import { StoryHeader } from 'components/StoryHeader'

interface StoryProps extends GitLogProps, GraphProps {
  pageSize?: number
  page?: number
  showTable: boolean
  showBranchesTags: boolean
  showCommitNodeHashes: boolean
}

const meta: Meta<StoryProps> = {
  title: 'GitLog',
  component: GitLog,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    entries: [],
    showTable: true,
    currentBranch: 'release',
    showBranchesTags: true,
    showCommitNodeHashes: false,
    showCommitNodeTooltips: false,
    showHeaders: true,
    showGitIndex: true,
    enableResize: false,
    nodeTheme: 'default',
    nodeSize: 20,
    orientation: 'normal',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    defaultGraphWidth: 200,
    rowSpacing: 0,
    page: 0,
    pageSize: 200
  },
  argTypes: {
    entries: {
      name: 'Git Log Entries',
      table: {
        category: 'Required Props'
      }
    },
    currentBranch: {
      name: 'Current Branch',
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
    showBranchesTags: {
      name: 'Show Branches / Tags',
      table: {
        category: 'Visibility'
      }
    },
    showHeaders: {
      name: 'Show Headers',
      table: {
        category: 'Visibility'
      }
    },
    showCommitNodeTooltips: {
      name: 'Show Commit Tooltips',
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
      table: {
        category: 'Visibility'
      }
    },
    pageSize: {
      name: 'Page Size',
      table: {
        category: 'Pagination'
      },
      control: {
        type: 'range',
        min: 1,
        max: 300
      }
    },
    page: {
      name: 'Page Number',
      table: {
        category: 'Pagination'
      },
      control: {
        type: 'range',
        min: 0,
        max: 50
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
        min: 100,
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
    }
  }
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  render: (args) => {
    const {
      theme,
      loading,
      colours,
      entries,
      branch,
      buildUrls,
      repository,
      backgroundColour,
      handleChangeTheme,
      handleChangeColors,
      handleChangeRepository
    } = useStoryState()

    return (
      <div style={{ background: backgroundColour }} className={styles.container}>
        <StoryHeader
          theme={theme}
          colours={colours}
          repository={repository}
          onChangeTheme={handleChangeTheme}
          onChangeColours={handleChangeColors}
          onChangeRepository={handleChangeRepository}
        />

        {loading && (
          <div className={styles.loading}>
            <Loading theme={theme} />
          </div>
        )}

        {!loading && entries && (
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
              containerClass: styles.gitLogContainer
            }}
            indexStatus={{
              added: 2,
              modified: 5,
              deleted: 1
            }}
            urls={buildUrls}
          >
            {args.showBranchesTags && (
              <GitLog.Tags />
            )}

            <GitLog.Graph
              nodeSize={args.nodeSize}
              nodeTheme={args.nodeTheme}
              orientation={args.orientation}
              enableResize={args.enableResize}
              showCommitNodeHashes={args.showCommitNodeHashes}
              showCommitNodeTooltips={args.showCommitNodeTooltips}
            />

            {args.showTable && (
              <GitLog.Table
                className={styles.table}
                timestampFormat={args.timestampFormat}
              />
            )}
          </GitLog>
        )}
      </div>
    )
  }
}