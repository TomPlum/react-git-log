import type { Meta, StoryObj } from '@storybook/react'
import styles from './GitLog.stories.module.scss'
import { type Commit, GitLog, GitLogPaged, GitLogPagedProps, HTMLGridGraphProps, Canvas2DGraphProps } from '@tomplum/react-git-log'
import { Loading } from 'components/Loading'
import { StoryHeader } from 'components/StoryHeader'
import { useStoryState } from 'hooks/useStoryState'
import { useState } from 'react'
import { Pagination } from 'components/Pagination'

interface StoryProps extends GitLogPagedProps, HTMLGridGraphProps, Canvas2DGraphProps {
  showTable: boolean
  showCommitNodeHashes: boolean
  renderStrategy: 'html-grid' | 'canvas'
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
    }
  }
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  render: (args) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(20)

    const {
      theme,
      loading,
      colours,
      entries,
      branch,
      buildUrls,
      repository,
      headCommitHash,
      backgroundColour,
      handleChangeTheme,
      handleChangeColors,
      handleChangeRepository
    } = useStoryState({
      isServerSidePaginated: true
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
            <Pagination
              theme={theme}
              pageSize={pageSize}
              currentPage={pageNumber}
              total={entries?.length ?? 0}
              onChangePage={newPage => setPageNumber(newPage)}
              onChangePageSize={newSize => setPageSize(newSize)}
            />
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
            entries={entries.slice(pageSize * (pageNumber - 1), pageSize * pageNumber)}
            branchName={branch}
            colours={colours.colors}
            headCommitHash={headCommitHash}
            classes={{
              containerStyles: {
                background: backgroundColour
              },
              containerClass: styles.gitLogContainer
            }}
            indexStatus={{
              added: 0,
              modified: 2,
              deleted: 3
            }}
            urls={buildUrls}
          >
            {args.renderStrategy === 'html-grid' && (
              <GitLog.GraphHTMLGrid
                nodeSize={args.nodeSize}
                nodeTheme={args.nodeTheme}
                orientation={args.orientation}
                enableResize={args.enableResize}
                showCommitNodeHashes={args.showCommitNodeHashes}
                showCommitNodeTooltips={args.showCommitNodeTooltips}
              />
            )}

            {args.renderStrategy === 'canvas' && (
              <GitLog.GraphCanvas2D
                nodeSize={args.nodeSize}
                nodeTheme={args.nodeTheme}
                orientation={args.orientation}
                enableResize={args.enableResize}
              />
            )}

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