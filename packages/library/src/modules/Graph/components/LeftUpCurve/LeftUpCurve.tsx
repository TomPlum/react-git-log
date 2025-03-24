import styles from './LeftUpCurve.module.scss'
import { NODE_WIDTH, ROW_HEIGHT } from 'constants/constants'
import { CurvedEdge } from 'modules/Graph/components/CurvedEdge'
import { useGitContext } from 'context/GitContext'
import { LeftUpCurveProps } from './types'

export const LeftUpCurve = ({ color, isPlaceholder }: LeftUpCurveProps) => {
  const { rowSpacing } = useGitContext()

  const borderStyle = isPlaceholder ? 'dotted' : 'solid'
  
  return (
    <div id='left-up-curve' data-testid='left-up-curve' className={styles.container}>
      <div
        id='left-up-curve-top-line'
        data-testid='left-up-curve-top-line'
        className={styles.line}
        style={{
          top: 0,
          left: 'calc(50% - 1px)',
          borderRight: `2px ${borderStyle} ${color}`,
          height: (ROW_HEIGHT + rowSpacing - NODE_WIDTH) / 2
        }}
      />

      <CurvedEdge
        colour={color}
        dashed={isPlaceholder}
        id='left-up-curve-curved-line'
        path='M 0,53 A 50,50 0 0,0 50,0'
      />

      <div
        id='left-up-curve-left-line'
        data-testid='left-up-curve-left-line'
        className={styles.line}
        style={{
          left: 0,
          top: '50%',
          height: 0,
          borderBottom: `2px ${borderStyle} ${color}`,
          width: `calc(50% - ${NODE_WIDTH / 2}px)`
        }}
      />
    </div>
  )
}