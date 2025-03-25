import classNames from 'classnames'
import styles from './Layout.module.scss'
import { Children, isValidElement, PropsWithChildren, ReactElement, useMemo } from 'react'
import { GitLog } from '../../GitLog'
import { useGitContext } from 'context/GitContext'
import { useTheme } from 'hooks/useTheme'

export const Layout = ({ children }: PropsWithChildren) => {
  const { tags, graph, table } = useMemo(() => {
    let tags: ReactElement | null = null
    let graph: ReactElement | null = null
    let table: ReactElement | null = null

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === GitLog.Tags) {
          if (tags) throw new Error('<GitLog /> can only have one <GitLog.Tags /> child.')
          tags = child
        } else if (child.type === GitLog.Graph) {
          if (graph) throw new Error('<GitLog /> can only have one <GitLog.Graph /> child.')
          graph = child
        } else if (child.type === GitLog.Table) {
          if (table) throw new Error('<GitLog /> can only have one <GitLog.Table /> child.')
          table = child
        }
      }
    })

    return { tags, graph, table }
  }, [children])

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