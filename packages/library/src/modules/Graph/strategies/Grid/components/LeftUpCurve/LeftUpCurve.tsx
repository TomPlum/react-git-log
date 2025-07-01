import styles from './LeftUpCurve.module.scss'
import { CURVE_SIZE, ROW_HEIGHT } from 'constants/constants'
import { CurvedEdge } from 'modules/Graph/strategies/Grid/components/CurvedEdge'
import { useGitContext } from 'context/GitContext'
import { LeftUpCurveProps } from './types'
import { BreakPoint } from 'modules/Graph/strategies/Grid/components/BreakPoint'

export const LeftUpCurve = ({ color, isPlaceholder, showTopBreakPoint }: LeftUpCurveProps) => {
  const { rowSpacing } = useGitContext()

  const borderStyle = isPlaceholder ? 'dotted' : 'solid'
  
  return (
    <div id='left-up-curve' data-testid='left-up-curve' className={styles.container}>
      {showTopBreakPoint && (
        <BreakPoint
          position='top'
          color={color}
          style={{
            slash: { left: '50%' },
            dot: { left: '50%' },
            'zig-zag': { left: 'calc(50% - 2px)' },
          }}
        />
      )}

      <div
        id='left-up-curve-top-line'
        data-testid='left-up-curve-top-line'
        className={styles.line}
        style={{
          top: 0,
          left: 'calc(50% - 1px)',
          borderRight: `2px ${borderStyle} ${color}`,
          height: (ROW_HEIGHT + rowSpacing - CURVE_SIZE) / 2
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
          width: `calc(50% - ${CURVE_SIZE / 2}px)`
        }}
      />
    </div>
  )
}