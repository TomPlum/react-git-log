import styles from './Tags.module.scss'
import { BranchTag } from './components/BranchTag'
import { useGitContext } from 'context/GitContext'
import { useCallback, useMemo } from 'react'
import { ROW_HEIGHT } from 'constants/constants'
import { Commit } from 'types/Commit'

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
  const {
    previewedCommit,
    selectedCommit,
    indexCommit,
    graphData,
    paging,
    graphWidth,
    rowSpacing,
    isIndexVisible
  } = useGitContext()

  const preparedCommits = useMemo(() => {
    const data = graphData.commits.slice(paging?.startIndex, paging?.endIndex)

    if (isIndexVisible && indexCommit) {
      data.unshift(indexCommit)
    }

    return prepareCommits(data)
  }, [graphData.commits, indexCommit, paging?.endIndex, isIndexVisible, paging?.startIndex])

  const tagLineWidth = useCallback((commit: Commit) => {
    const columnWidth = graphWidth / graphData.graphWidth

    if (commit.hash === 'index') {
      return columnWidth / 2
    }

    const columnIndex = graphData.positions.get(commit.hash)![1]

    return  (columnWidth * columnIndex) + (columnWidth / 2)
  }, [graphWidth, graphData.graphWidth, graphData.positions])

  return (
    <div className={styles.container}>
      {preparedCommits.map((commit, i) => {
        const shouldPreviewBranch = previewedCommit && commit.hash === previewedCommit.hash
        const selectedIsNotTip = selectedCommit && commit.hash === selectedCommit.hash
        const isIndexCommit = commit.hash === indexCommit?.hash

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
              key={`tag_${commit.hash}`}
              height={ROW_HEIGHT + rowSpacing}
              lineWidth={tagLineWidth(commit)}
              lineRight={-tagLineWidth(commit)}
            />
          )
        } else {
          return (
            <div
              id={`empty-tag-${i}`}
              key={`empty-tag-${i}`}
              className={styles.tag}
              data-testid={`empty-tag-${i}`}
              style={{ height: ROW_HEIGHT + rowSpacing }}
            />
          )
        }
      })}
    </div>
  )
}