import type { Meta, StoryObj } from '@storybook/react'
import styles from './GitLog.stories.module.scss'
import { type Commit, GitLogPaged, GitLogPagedProps, GraphProps } from '@tomplum/react-git-log'
import { Loading } from 'components/Loading'
import { StoryHeader } from 'components/StoryHeader'
import { useStoryState } from 'hooks/useStoryState'
import { useArgs } from '@storybook/preview-api'
import { useState } from 'react'

interface StoryProps extends GitLogPagedProps, GraphProps {
  showTable: boolean
  showCommitNodeHashes: boolean
}

const meta: Meta<StoryProps> = {
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
    showCommitNodeTooltips: false,
    showHeaders: true,
    enableResize: false,
    enableExperimentalAnimation: false,
    nodeTheme: 'default',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    githubRepositoryUrl: 'https://github.com/TomPlum/sleep',
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
    enableExperimentalAnimation: {
      name: 'Enable Animation (Experimental)',
      table: {
        category: 'Visibility'
      }
    },
    githubRepositoryUrl: {
      name: 'Github Repository',
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
    const [, updateArgs] = useArgs<GitLogPagedProps>()
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(20)

    const {
      theme,
      loading,
      colours,
      entries,
      branch,
      repository,
      backgroundColour,
      handleChangeTheme,
      handleChangeColors,
      handleChangeRepository
    } = useStoryState({
      page: pageNumber,
      pageSize,
      onChangeRepository: ({ repository, branchName }) => {
        updateArgs({
          githubRepositoryUrl: `https://github.com/${repository}`,
          branchName
        })
      }
    })

    return (
      <div style={{ background: backgroundColour }} className={styles.container}>
        <StoryHeader
          theme={theme}
          colours={colours}
          repository={repository}
          onChangeTheme={handleChangeTheme}
          onChangeColours={handleChangeColors}
          onChangeRepository={handleChangeRepository}
        >
          <div style={{ marginTop: 20 }}>
            <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>
              {'<'}
            </button>

            <button onClick={() => setPageNumber(pageNumber + 1)}>
              {'>'}
            </button>
          </div>
        </StoryHeader>

        {loading && (
          <div className={styles.loading}>
            <Loading theme={theme} />
          </div>
        )}

        {!loading && entries && (
          <GitLogPaged
            {...args}
            theme={theme}
            entries={entries}
            branchName={branch}
            colours={colours.colors}
            headCommitHash='1352f4c'
            classes={{
              containerStyles: {
                background: backgroundColour
              },
              containerClass: styles.gitLogContainer
            }}
          >
            <GitLogPaged.Graph
              nodeTheme={args.nodeTheme}
              enableResize={args.enableResize}
              showCommitNodeHashes={args.showCommitNodeHashes}
              showCommitNodeTooltips={args.showCommitNodeTooltips}
            />

            {args.showTable && (
              <GitLogPaged.Table
                className={styles.table}
                timestampFormat={args.timestampFormat}
              />
            )}
          </GitLogPaged>
        )}
      </div>
    )
  }
}