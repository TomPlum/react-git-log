import GitHubLogo from 'assets/github-mark.svg?react'
import styles from './PackageInfo.module.scss'
import { PackageInfoProps } from './types'

export const PackageInfo = ({ theme }: PackageInfoProps) => {
  const textColour = theme === 'dark' ? 'white' : '#1a1a1a'

  return (
    <a href='https://github.com/TomPlum/react-git-log' className={styles.info}>
      <div className={styles.top}>
        <a className={styles.packageName}>
          react-git-log
        </a>
      </div>

      <div className={styles.bottom}>
        <GitHubLogo
          className={styles.github}
          style={{ fill: textColour }}
        />

        <span style={{ color: textColour }} className={styles.by}>
         by tomplum
       </span>
      </div>
    </a>
  )
}