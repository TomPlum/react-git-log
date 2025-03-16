import styles from './GitGraph.module.scss'
import { GitLog } from 'modules/Visualiser/components/GitLog'
import { Tags } from 'modules/Tags'
import { useResize } from 'modules/Visualiser/hooks/useResize'
import { useGitContext } from 'modules/Visualiser/context'
import classNames from 'classnames'
import { useTheme } from 'modules/Visualiser/hooks/useTheme'
import { Graph } from 'modules/Graph'

export const GitGraph = () => {
  const {
    classes,
    showGitLog,
    showBranchesTags,
    showTableHeaders
  } = useGitContext()

  const { textColour } = useTheme()

  const { width, ref, startResizing } = useResize()

  return (
    <div
      style={classes?.containerStyles}
      className={classNames(styles.container, classes?.containerClass)}
    >
      {showBranchesTags && (
        <div className={styles.tags}>
          {showTableHeaders && (
            <h4 style={{ color: textColour, marginLeft: 10 }} className={styles.title}>
              Branch / Tag
            </h4>
          )}

          <Tags />
        </div>
      )}

      <div className={styles.graphContainer} style={{ width }} ref={ref}>
        {showTableHeaders && (
          <h4 style={{ color: textColour }} className={styles.title}>
            Graph
          </h4>
        )}

        <Graph />

        <div
          onMouseDown={startResizing}
          className={styles.dragHandle}
        />
      </div>

      {showGitLog && (
        <div className={styles.log}>
          <GitLog />
        </div>
      )}
    </div>
  )
}