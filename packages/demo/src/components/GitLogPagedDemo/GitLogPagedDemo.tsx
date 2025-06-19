import { useState } from 'react'
import { useStoryState } from '@hooks/useStoryState'
import styles from 'GitLog.stories.module.scss'
import { StoryHeader } from '@components/StoryHeader'
import { Pagination } from '@components/Pagination'
import { Loading } from '@components/Loading'
import { GitLog, GitLogPaged } from '@tomplum/react-git-log'
import { GitLogPagedStoryProps } from './types'

export const GitLogPagedDemo = (args: GitLogPagedStoryProps) => {
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
            added: args.indexStatusFilesAdded,
            modified: args.indexStatusFilesModified,
            deleted: args.indexStatusFilesDeleted
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