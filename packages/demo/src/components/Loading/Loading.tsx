import styles from './Loading.module.scss'
import { LoadingProps } from './types'

export const Loading = ({ theme }: LoadingProps) => {
  const lineColour = theme === 'dark' ? ['#f8f8f8', '#0000'] : ['#524656', '#0000']

  return (
    <div className={styles.container}>
      <div
        style={{
          background: `linear-gradient(90deg,${lineColour[0]} 50%,${lineColour[1]} 0) -25% 100%/50% 3px repeat-x border-box`
        }}
        className={styles.loading}
      />

      <span style={{ color: lineColour[0] }}>Loading...</span>
    </div>
  )
}