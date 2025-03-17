import styles from './LeftDownCurve.module.scss'
import { NODE_WIDTH, ROW_HEIGHT } from 'constants.ts'
import { CurvedEdge } from 'modules/Graph/components/CurvedEdge'
import { useGitContext } from 'context'
import { LeftDownCurveProps } from './types'

export const LeftDownCurve = ({ color, isPlaceholder }: LeftDownCurveProps) => {
  const { rowSpacing } = useGitContext()
  
  return (
    <>
      <div
        className={styles.curve}
        style={{
          bottom: 0,
          left: 'calc(50% - 1px)',
          borderRight: `2px solid ${color}`,
          height: (ROW_HEIGHT + rowSpacing - NODE_WIDTH) / 2
        }}
      />

      <CurvedEdge
        colour={color}
        path='M 0,53 A 50,50 0 0,1 50,100'
        dashed={isPlaceholder}
      />

      <div
        className={styles.curve}
        style={{
          left: 0,
          top: '50%',
          height: 0,
          borderBottom: `2px solid ${color}`,
          width: `calc(50% - ${NODE_WIDTH / 2}px)`
        }}
      />
    </>
  )
}