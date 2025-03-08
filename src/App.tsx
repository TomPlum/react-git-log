import styles from './App.module.scss'
import { GitLogEntry } from 'modules/Visualiser'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'
import { useEffect, useState } from 'react'
import { GitGraph } from 'modules/Visualiser/components/GitGraph'

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
      <button onClick={() => setShowTags(!showTags)}>
        {showTags ? 'Hide' : 'Show'} Tags / Branches
      </button>

      <button onClick={() => setShowGitLog(!showGitLog)}>
        {showGitLog ? 'Hide' : 'Show'} Git Log
      </button>

      {entries && (
        <div className={styles.content}>
          <GitGraph
            entries={entries}
            showGitLog={showGitLog}
            showBranchesTags={showTags}
          />
        </div>
      )}

    </div>
  )
}

export default App
