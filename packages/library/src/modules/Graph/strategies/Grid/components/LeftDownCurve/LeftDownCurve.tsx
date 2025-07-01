import styles from './LeftDownCurve.module.scss'
import { CURVE_SIZE, ROW_HEIGHT } from 'constants/constants'
import { CurvedEdge } from 'modules/Graph/strategies/Grid/components/CurvedEdge'
import { useGitContext } from 'context/GitContext'
import { LeftDownCurveProps } from './types'
import { BreakPoint } from 'modules/Graph/strategies/Grid/components/BreakPoint'

export const LeftDownCurve = ({ color, isPlaceholder, showBottomBreakPoint }: LeftDownCurveProps) => {
  const { rowSpacing } = useGitContext()

  const borderStyle = isPlaceholder ? 'dotted' : 'solid'

  return (
    <div id='left-down-curve' data-testid='left-down-curve' className={styles.container}>
      {showBottomBreakPoint && (
        <BreakPoint
          color={color}
          position='bottom'
          style={{ left: '50%' }}
        />
      )}

      <div
        id='left-down-curve-bottom-line'
        data-testid='left-down-curve-bottom-line'
        className={styles.line}
        style={{
          bottom: 0,
          left: 'calc(50% - 1px)',
          borderRight: `2px ${borderStyle} ${color}`,
          height: (ROW_HEIGHT + rowSpacing - CURVE_SIZE) / 2
        }}
      />

      <CurvedEdge
        colour={color}
        dashed={isPlaceholder}
        id='left-down-curve-curved-line'
        path='M 0,53 A 50,50 0 0,1 50,100'
      />

      <div
        id='left-down-curve-left-line'
        data-testid='left-down-curve-left-line'
        className={styles.line}
        style={{
          left: 0,
          top: '50%',
          height: 0,
          borderBottom: `2px ${borderStyle} ${color}`,
          width: `calc(50% - ${CURVE_SIZE / 2}px)`
        }}
      />
    </div>
  )
}