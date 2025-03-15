import { TABLE_TOP_OFFSET } from './types.ts'
import styles from './GitGraph.module.scss'
import { GitLog } from 'modules/Visualiser/components/GitLog'
import { BranchesTags } from 'modules/Visualiser/components/BranchesTags'
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

  // TODO: Re-integrate resizing with the new Graph component
  const { width, ref } = useResize()

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

          <BranchesTags />
        </div>
      )}

      <div className={styles.graphContainer} style={{ width }} ref={ref}>
        {showTableHeaders && (
          <h4 style={{ color: textColour }} className={styles.title}>
            Graph
          </h4>
        )}

        <Graph />
      </div>

      {showGitLog && (
        <div className={styles.log} style={{ marginTop: TABLE_TOP_OFFSET }}>
          <GitLog />
        </div>
      )}
    </div>
  )
}