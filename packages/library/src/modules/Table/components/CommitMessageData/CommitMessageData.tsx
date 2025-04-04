import styles from './CommitMessageData.module.scss'
import { CommitMessageDataProps } from './types'
import { IndexStatus } from 'modules/Table/components/IndexStatus'

export const CommitMessageData = ({ index, isIndex, commitMessage, style }: CommitMessageDataProps) => {
  return (
    <div
      style={style}
      title={commitMessage}
      className={styles.message}
      id={`react-git-log-table-data-commit-message-${index}`}
      data-testid={`react-git-log-table-data-commit-message-${index}`}
    >
      {commitMessage}

      {isIndex && (
        <IndexStatus />
      )}
    </div>
  )
}