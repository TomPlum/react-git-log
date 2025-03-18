import styles from './LeftUpCurve.module.scss'
import { NODE_WIDTH, ROW_HEIGHT } from 'constants/constants'
import { CurvedEdge } from 'modules/Graph/components/CurvedEdge'
import { useGitContext } from 'context/GitContext'
import { LeftUpCurveProps } from './types'

export const LeftUpCurve = ({ color, isPlaceholder }: LeftUpCurveProps) => {
  const { rowSpacing } = useGitContext()
  
  return (
    <>
      <div
        className={styles.curve}
        style={{
          top: 0,
          left: 'calc(50% - 1px)',
          borderRight: `2px solid ${color}`,
          height: (ROW_HEIGHT + rowSpacing - NODE_WIDTH) / 2
        }}
      />
      <CurvedEdge
        colour={color}
        dashed={isPlaceholder}
        path='M 0,53 A 50,50 0 0,0 50,0'
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