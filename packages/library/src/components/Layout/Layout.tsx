import classNames from 'classnames'
import styles from './Layout.module.scss'
import { useGitContext } from 'context/GitContext'
import { useTheme } from 'hooks/useTheme'
import { LayoutProps } from './types'

export const Layout = ({ tags, graph, table }: LayoutProps) => {
  const { classes, showTableHeaders } = useGitContext()

  const { textColour } = useTheme()

  return (
    <div
      id='react-git-log'
      data-testid='react-git-log'
      style={classes?.containerStyles}
      className={classNames(styles.container, classes?.containerClass)}
    >
      {tags && (
        <div className={styles.tags}>
          {showTableHeaders && (
            <h4 style={{ color: textColour, marginLeft: 10 }} className={styles.title}>
              Branch / Tag
            </h4>
          )}

          {tags}
        </div>
      )}

      {graph && (
        <div className={styles.graph}>
          {showTableHeaders && (
            <h4 style={{ color: textColour }} className={styles.title}>
              Graph
            </h4>
          )}

          {graph}
        </div>
      )}

      {table && (
        <div className={styles.table}>
          {table}
        </div>
      )}
    </div>
  )
}