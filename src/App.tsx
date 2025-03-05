import styles from './App.module.scss'
import { GitLogEntry, Visualiser } from 'modules/Visualiser'
import { parseGitLogOutput } from 'modules/Visualiser/utils/gitLogParser'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMouse } from '@uidotdev/usehooks'

const App = () => {
  const [entries, setEntries] = useState<GitLogEntry[]>()

  const [mouse] = useMouse()
  const [dragging, setDragging] = useState(false)
  const graphContainerRef = useRef<HTMLDivElement>(null)

  const graphContainerWidth = useMemo(() => {
    if (graphContainerRef.current && dragging) {
      const containerLeft = graphContainerRef.current.getBoundingClientRect().x
      const containerWidth = graphContainerRef.current.getBoundingClientRect().width
      const containerRight = containerLeft + containerWidth
      const newWidth = containerWidth + (mouse.x - containerRight)

      if (newWidth > 500 || newWidth < 200) {
        return containerWidth
      }

      return newWidth
    }
  }, [dragging, mouse.x])

  useEffect(() => {
    const stopDragging = () => {
      setDragging(false)
    }

    window.addEventListener('mouseup', stopDragging)

    return () => {
      window.removeEventListener('mouseup', stopDragging)
    }
  }, [])

  useEffect(() => {
    const fetchFile = async () => {
      const response = await fetch('/git-log.txt')
      return response.text()
    }

    fetchFile().then(result => {
      setEntries(parseGitLogOutput(result))
    })
  }, [])

  return (
    <div className={styles.app}>
      {entries && (
        <div className={styles.content}>
          <div className={styles.graphContainer} style={{ width: graphContainerWidth }} ref={graphContainerRef}>
            <Visualiser
              entries={entries}
            />

            <div
              className={styles.dragHandle}
              onMouseDown={() => setDragging(true)}
            />
          </div>

          <table className={styles.table}>
            <tbody>
              {entries.map((commit) => (
                <tr key={commit.hash}>
                  <td>{commit.hash}</td>
                  <td>{commit.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default App
