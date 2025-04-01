import styles from './TableRow.module.scss'
import { GitLogTableRowProps } from './types'
import { CSSProperties, useMemo } from 'react'
import { useTheme } from 'hooks/useTheme'
import { useGitContext } from 'context/GitContext'
import { useSelectCommit } from 'hooks/useSelectCommit'
import { BACKGROUND_HEIGHT_OFFSET, ROW_HEIGHT } from 'constants/constants'
import { CommitMessageData } from 'modules/Table/components/CommitMessageData'
import { AuthorData } from 'modules/Table/components/AuthorData'
import { TimestampData } from 'modules/Table/components/TimestampData'

export const TableRow = ({
  index,
  commit,
  isPlaceholder,
  rowStyleOverrides,
  dataStyleOverrides,
  ...props
}: GitLogTableRowProps) => {
  const {
    textColour,
    hoverColour,
    reduceOpacity,
    getCommitColour,
    shiftAlphaChannel
  } = useTheme()

  const { selectCommitHandler } = useSelectCommit()
  const { selectedCommit, previewedCommit, nodeSize } = useGitContext()

  const isMergeCommit = commit.parents.length > 1

  const backgroundColour = useMemo(() => {
    const colour = getCommitColour(commit)

    if (selectedCommit?.hash === commit.hash) {
      if (isPlaceholder) {
        return hoverColour
      }

      return  reduceOpacity(colour, 0.15)
    }

    if (previewedCommit?.hash === commit.hash) {
      if (isPlaceholder) {
        return hoverColour
      }

      return hoverColour
    }

    return 'transparent'
  }, [getCommitColour, commit, selectedCommit?.hash, previewedCommit?.hash, isPlaceholder, reduceOpacity, hoverColour])

  const backgroundStyles = useMemo(() => {
    const height = nodeSize + BACKGROUND_HEIGHT_OFFSET
    const padding = (ROW_HEIGHT - height) / 2
    const end = padding + height

    return {
      background: `linear-gradient(
        to bottom, 
        transparent ${padding}px, 
        ${backgroundColour} ${padding}px,
        ${backgroundColour} ${end}px,
        transparent ${end}px
      )`
    }
  }, [backgroundColour, nodeSize])

  const shouldRenderHyphenValue = commit.hash === 'index' || Boolean(isPlaceholder)
  const shouldReduceOpacity = !isPlaceholder && (isMergeCommit || commit.hash === 'index')

  const tableDataStyle: CSSProperties = {
    lineHeight: `${ROW_HEIGHT}px`,
    color: shiftAlphaChannel(textColour, shouldReduceOpacity ? 0.4 : 1),
    ...backgroundStyles,
    ...dataStyleOverrides
  }

  return (
    <div
      {...props}
      className={styles.row}
      style={rowStyleOverrides}
      id={`react-git-log-table-row-${index}`}
      onMouseOut={selectCommitHandler.onMouseOut}
      data-testid={`react-git-log-table-row-${index}`}
      onClick={() => selectCommitHandler.onClick(commit)}
      onMouseOver={() => selectCommitHandler.onMouseOver(commit)}
    >
      <CommitMessageData
        index={index}
        style={tableDataStyle}
        commitMessage={commit.message}
      />

      <AuthorData
        index={index}
        author={commit.author}
        style={tableDataStyle}
        isPlaceholder={shouldRenderHyphenValue}
      />

      <TimestampData
        index={index}
        style={tableDataStyle}
        timestamp={commit.committerDate}
        isPlaceholder={shouldRenderHyphenValue}
      />
    </div>
  )
}