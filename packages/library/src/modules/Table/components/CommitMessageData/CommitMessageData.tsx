import styles from './CommitMessageData.module.scss'
import { CommitMessageDataProps } from './types'

export const CommitMessageData = ({ index, commitMessage, style }: CommitMessageDataProps) => {
  return (
    <div
      style={style}
      title={commitMessage}
      className={styles.message}
      id={`react-git-log-table-data-commit-message-${index}`}
      data-testid={`react-git-log-table-data-commit-message-${index}`}
    >
      {commitMessage}
    </div>
  )
}