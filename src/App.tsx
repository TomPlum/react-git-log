import './App.css'
import { Visualiser } from './modules/Visualiser'
import { parseGitLogOutput } from './modules/Visualiser/utils/gitLogParser.ts'
import { useEffect, useState } from 'react'

function App() {
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
    <>
      {file && (
        <Visualiser
          entries={parseGitLogOutput(file)}
        />
      )}
    </>
  )
}

export default App
