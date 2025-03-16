import styles from './Tags.module.scss'
import { Commit, ROW_HEIGHT } from 'modules/Visualiser'
import { BranchTag } from './components/BranchTag'
import { useGitContext } from 'context'
import { useTheme } from 'hooks/useTheme'
import { useCallback, useMemo } from 'react'

const prepareCommits = (commits: Commit[]) => {
  const tagsSeen = new Map<string, boolean>()

  return commits.map(commit => {
    const isTag = commit.branch.includes('tags/')
    const hasBeenRendered = tagsSeen.has(commit.branch)

    const shouldRenderTag = isTag && !hasBeenRendered
    if (shouldRenderTag) {
      tagsSeen.set(commit.branch, true)
    }

    return {
      ...commit,
      isMostRecentTagInstance: shouldRenderTag
    }
  })
}

export const Tags = () => {
  const { getCommitColour } = useTheme()
  const { previewedCommit, selectedCommit, indexCommit, graphData, paging } = useGitContext()

  const preparedCommits = useMemo(() => {
    const data = graphData.commits.slice(paging.startIndex, paging.endIndex)

    if (paging.startIndex === 0) {
      data.unshift(indexCommit)
    }

    return prepareCommits(data)
  }, [graphData.commits, indexCommit, paging.endIndex, paging.startIndex])

  const tagLineWidth = useCallback((commit: Commit) => {
    const graphContainerWidth = 400 // TODO: Source dynamically
    const columnWidth = graphContainerWidth / graphData.graphWidth

    if (commit.hash === 'index') {
      return columnWidth / 2
    }

    const columnIndex = graphData.positions.get(commit.hash)![1]

    return  (columnWidth * columnIndex) + (columnWidth / 2)
  }, [graphData.graphWidth, graphData.positions])

  return (
    <div className={styles.container}>
      {preparedCommits.map((commit, i) => {
        const shouldPreviewBranch = previewedCommit && commit.hash === previewedCommit.hash
        const selectedIsNotTip = selectedCommit && commit.hash === selectedCommit.hash
        const isIndexCommit = commit.hash === indexCommit.hash

        const showRenderBranchTag = commit.isBranchTip
          || shouldPreviewBranch
          || selectedIsNotTip
          || commit.isMostRecentTagInstance
          || isIndexCommit

        if (showRenderBranchTag) {
          return (
            <BranchTag
              commit={commit}
              id={i.toString()}
              height={ROW_HEIGHT}
              key={`tag_${commit.hash}`}
              color={getCommitColour(commit)}
              lineWidth={tagLineWidth(commit)}
              lineRight={-tagLineWidth(commit)}
            />
          )
        } else {
          return (
            <div
              className={styles.tag}
              key={`empty_tag_${commit.hash}`}
              style={{ height: ROW_HEIGHT }}
            />
          )
        }
      })}
    </div>
  )
}