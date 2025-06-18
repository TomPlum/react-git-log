import { useStoryState } from '@hooks/useStoryState'
import styles from 'GitLog.stories.module.scss'
import { StoryHeader } from '@components/StoryHeader'
import { Loading } from '@components/Loading'
import { GitLog } from '@tomplum/react-git-log'
import { GitLogStoryProps } from './types'

export const GitLogDemo = (args: GitLogStoryProps) => {
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