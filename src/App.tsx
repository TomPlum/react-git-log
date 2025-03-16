import styles from './App.module.scss'
import { GitLogEntry, GitLogVisualiser } from 'modules/Visualiser'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'
import { useEffect, useState } from 'react'

const App = () => {
  const [entries, setEntries] = useState<GitLogEntry[]>()

  const [showTags, setShowTags] = useState(true)
  const [showGitLog, setShowGitLog] = useState(true)

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch('/git-log-all.txt')
      return response.text()
    }

    fetchFile().then(result => {
      setEntries(parseGitLogOutput(result))
    })
  }, [])

  return (
    <div className={styles.app}>
      <button onClick={() => setShowTags(!showTags)} className={styles.button}>
        {showTags ? 'Hide' : 'Show'} Tags / Branches
      </button>

      <button onClick={() => setShowGitLog(!showGitLog)} className={styles.button}>
        {showGitLog ? 'Hide' : 'Show'} Git Log
      </button>

      {entries && (
        <div className={styles.content}>
          <GitLogVisualiser
            entries={entries}
            currentBranch='release'
            showGitLog={showGitLog}
            showBranchesTags={showTags}
          />
        </div>
      )}

    </div>
  )
}

export default App
