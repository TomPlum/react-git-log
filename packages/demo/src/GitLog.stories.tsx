import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useEffect, useState } from 'react'
import styles from './GitLog.stories.module.scss'
import GitHubLogo from 'assets/github-mark.svg?react'
import {
  type ThemeMode,
  type Commit,
  type GitLogEntry,
  type GitLogProps,
  GitLog
} from '@tomplum/react-git-log'
import { ColourSelection, ColourSelector } from 'components/ColourSelector'
import { fetchLogEntryData } from 'utils/fetchLogEntryData'
import { ThemeToggle } from 'components/ThemeToggle'
import { rainbow } from 'themes.ts'
import { RepositorySelector } from 'components/RepositorySelector'
import { Loading } from 'components/Loading'

// TODO: once mono repo in place, extract types and components from here

const branches: Record<string, string> = {
  'TomPlum/sleep': 'release',
  'TomPlum/learn-japanese': 'feature/JPUI-51',
  'TomPlum/advent-of-code-2019': 'master'
}

interface StoryProps extends GitLogProps {
  pageSize?: number
  page?: number
  repository: string
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
    showTableHeaders: true,
    enableResize: false,
    enableExperimentalAnimation: false,
    nodeTheme: 'default',
    onSelectCommit: (commit?: Commit) => {
      console.info(`Selected commit ${commit?.hash}`)
    },
    githubRepositoryUrl: 'https://github.com/TomPlum/sleep',
    defaultGraphContainerWidth: 200,
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
    showTableHeaders: {
      name: 'Show Table Headers',
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
      options: ['default', 'merge']
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
    defaultGraphContainerWidth: {
      name: 'Graph Width',
      table: {
        category: 'Dimensions'
      },
      control: {
        type: 'range',
        min: 200,
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

export const Default: Story = {
  render: (args) => {
    const [loading, setLoading] = useState(true)

    const [branch, setBranch] = useState('release')
    const [entries, setEntries] = useState<GitLogEntry[]>()

    const [theme, setTheme] = useState<ThemeMode>('dark')
    const [colours, setColours] = useState<ColourSelection>({ id: 'rainbow', colors: rainbow })
    const [repository, setRepository] = useState('TomPlum/sleep')

    const getData = useCallback(async (repository: string) => {
      return fetchLogEntryData(repository)
    }, [])

    useEffect(() => {
      setLoading(true)

      getData('TomPlum/sleep').then((data) => {
        setEntries(data)
      }).finally(() => {
        setLoading(false)
      })
    }, [getData])

    const handleChangeRepository = useCallback(async (selected: string) => {
      const newEntries = await getData(selected)

      setEntries(newEntries)
      setRepository(selected)
      setBranch(branches[selected])
    }, [getData])

    const handleChangeColors = useCallback((selected: ColourSelection) => {
      setColours(selected)
    }, [])

    const backgroundColour = theme === 'dark' ? '#1a1a1a' : 'white'
    const textColour = theme === 'dark' ? 'white' : '#1a1a1a'

    return (
      <div style={{ background: backgroundColour }} className={styles.container}>
        <div
          className={styles.header}
          style={{
            borderBottom: `1px solid ${theme === 'dark' ? 'rgb(112,112,112)' : 'rgb(42,42,42)'}`
          }}
        >
          <div className={styles.controls}>
            <RepositorySelector
              theme={theme}
              selected={repository}
              onSelect={handleChangeRepository}
            />

            <ColourSelector
              theme={theme}
              selected={colours.id}
              onChange={handleChangeColors}
            />

            <ThemeToggle
              theme={theme}
              onChange={setTheme}
            />
          </div>

         <div className={styles.info}>
           <div className={styles.top}>
             <a href='https://github.com/TomPlum/react-git-log' className={styles.link}>
               react-git-log
             </a>
           </div>

           <div className={styles.bottom}>
             <GitHubLogo
               className={styles.github}
               style={{ fill: textColour }}
             />

             <span style={{ color: textColour }} className={styles.by}>
               by tomplum
             </span>
           </div>
         </div>
        </div>

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
              logTableClass: styles.table
            }}
          />
        )}
      </div>
    )
  }
}