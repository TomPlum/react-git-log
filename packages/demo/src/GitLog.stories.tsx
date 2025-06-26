import type { Meta, StoryObj } from '@storybook/react-vite'
import styles from './GitLog.stories.module.scss'
import { type Commit, GitLog } from '@tomplum/react-git-log'
import { Loading } from '@components/Loading'
import { useStoryState } from '@hooks/useStoryState'
import { StoryHeader } from '@components/StoryHeader'
import { GitLogDemo, GitLogStoryProps } from '@components/GitLogDemo'

const meta: Meta<GitLogStoryProps> = {
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
    enablePreviewedCommitStyling: true,
    enableSelectedCommitStyling: true,
    showHeaders: true,
    showGitIndex: true,
    enableResize: false,
    nodeTheme: 'default',
    renderStrategy: 'html-grid',
    nodeSize: 20,
    orientation: 'normal',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    defaultGraphWidth: 120,
    rowSpacing: 0,
    page: 0,
    pageSize: 200,
    indexStatusFilesModified: 5,
    indexStatusFilesAdded: 2,
    indexStatusFilesDeleted: 1
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
      type: 'boolean',
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
    enableSelectedCommitStyling: {
      name: 'Enable Selection Styling',
      type: 'boolean',
      table: {
        category: 'Visibility'
      }
    },
    enablePreviewedCommitStyling: {
      name: 'Enable Preview Styling',
      type: 'boolean',
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
    },
    onPreviewCommit: {
      name: 'onPreviewCommit',
      table: {
        category: 'Callback Functions'
      }
    },

    // Index Status
    indexStatusFilesModified: {
      name: 'Modified Files',
      type: {
        name: 'number',
      },
      table: {
        category: 'Git Index Status'
      }
    },
    indexStatusFilesAdded: {
      name: 'Added Files',
      type: {
        name: 'number',
      },
      table: {
        category: 'Git Index Status'
      }
    },
    indexStatusFilesDeleted: {
      name: 'Deleted Files',
      type: {
        name: 'number',
      },
      table: {
        category: 'Git Index Status'
      }
    },

    // Hiding defaults that have custom props to drive them
    paging: {
      table: {
        disable: true
      }
    },
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
    }
  }
} satisfies Meta<GitLogStoryProps>

export default meta
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  render: (args) => <GitLogDemo {...args} />
}

export const CustomTableRow = () => {
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
          colours={colours.colors}
          entries={entries}
          theme={theme}
          currentBranch={branch}
          showGitIndex={false}
          rowSpacing={80}
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
          <GitLog.GraphHTMLGrid
            highlightedBackgroundHeight={120}
          />

          <GitLog.Table
            className={styles.table}
            row={({ commit, backgroundColour }) => (
              <div
                className={styles.customRow}
                style={{
                  color: theme === 'dark' ? 'white': 'black',
                  backgroundColor: backgroundColour
                }}
              >
                <div className={styles.top}>
                  <p className={styles.message}>
                    {commit.message}
                  </p>
                </div>

                <div className={styles.bottom}>
                  <p
                    className={styles.author}
                    style={{
                      color: theme === 'dark' ? 'rgb(203,203,203)': 'rgb(56,56,56)',
                    }}
                  >
                    {commit.author?.name}
                  </p>

                  <p
                    className={styles.hash}
                    style={{
                      color: theme === 'dark' ? 'white': 'rgb(56,56,56)',
                      background: theme === 'dark' ? 'grey': 'rgb(224,224,224)',
                    }}
                  >
                    #{commit.hash}
                  </p>
                </div>
              </div>
            )}
          />
        </GitLog>
      )}
    </div>
  )
}

const nodeImages = ['millie', 'neo', 'millie_neo', 'neo_banana', 'neo_2', 'bella']

export const CustomCommitNode = () => {
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
          colours={colours.colors}
          entries={entries}
          theme={theme}
          currentBranch={branch}
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
          <GitLog.GraphHTMLGrid
            nodeSize={25}
            node={({ nodeSize, colour, isIndexPseudoNode, rowIndex }) => (
              <div
                className={styles.Node}
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  background: `url('https://placecats.com/${nodeImages[rowIndex % nodeImages.length]}/50/50?fit=contain&position=top') 50% 50%`,
                  border: `2px ${isIndexPseudoNode ? 'dotted' : 'solid'} ${colour}`
                }}
              />
            )}
          />

          <GitLog.Table
            className={styles.table}
          />
        </GitLog>
      )}
    </div>
  )
}