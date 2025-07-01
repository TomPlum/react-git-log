import { useStoryState } from '@hooks/useStoryState'
import styles from 'GitLog.stories.module.scss'
import { StoryHeader } from '@components/StoryHeader'
import { Loading } from '@components/Loading'
import { GitLog } from '@tomplum/react-git-log'
import { GitLogStoryProps } from './types'
import { useDemoContext } from '@context'

export const GitLogDemo = (args: GitLogStoryProps) => {
  const {
    loading,
    colours,
    entries,
    branch,
    buildUrls,
    repository,
    backgroundColour,
    handleChangeColors,
    handleChangeRepository
  } = useStoryState()

  const { search, theme } = useDemoContext()

  return (
    <div style={{ background: backgroundColour }} className={styles.container}>
      <StoryHeader
        colours={colours}
        repository={repository}
        onChangeColours={handleChangeColors}
        onChangeRepository={handleChangeRepository}
      />

      {loading && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}

      {!loading && entries && (
        <GitLog
          {...args}
          colours={colours.colors}
          entries={entries}
          theme={theme}
          currentBranch={branch}
          filter={search ? entries => {
            return entries.filter(commit => {
              return commit.message.includes(search)
            })
          } : undefined}
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
            added: args.indexStatusFilesAdded,
            modified: args.indexStatusFilesModified,
            deleted: args.indexStatusFilesDeleted
          }}
          urls={buildUrls}
        >
          {args.showBranchesTags && (
            <GitLog.Tags />
          )}

          {args.renderStrategy === 'html-grid' && (
            <GitLog.GraphHTMLGrid
              nodeSize={args.nodeSize}
              nodeTheme={args.nodeTheme}
              orientation={args.orientation}
              enableResize={args.enableResize}
              breakPointTheme={args.breakPointTheme}
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