import styles from './App.module.scss'
import { Visualiser } from 'modules/Visualiser'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'
import { useEffect, useState } from 'react'

const App = () => {
  const [file, setFile] = useState<string>()

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch('/git-log.txt')
      return response.text()
    }

    fetchFile().then(result => {
      setFile(result)
    })
  }, [])

  return (
    <div className={styles.app}>
      {file && (
        <Visualiser
          entries={parseGitLogOutput(file)}
        />
      )}
    </div>
  )
}

export default App
