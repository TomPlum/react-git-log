import { GitGraphProps } from './types.ts'

export const GitGraph = ({ commits }: GitGraphProps) => {
  const rowHeight = 30
  const colWidth = 20

  // Assign x positions for branches dynamically
  const branchMap = new Map<string, number>()
  let nextBranchX = 0

  const positionedCommits = commits.map((commit, index) => {
    const x = branchMap.get(commit.hash) ?? nextBranchX
    if (!branchMap.has(commit.hash)) {
      branchMap.set(commit.hash, x)
      nextBranchX += 1
    }

    commit.parents.forEach((parent) => {
      if (!branchMap.has(parent)) {
        branchMap.set(parent, nextBranchX++)
      }
    })

    return { ...commit, x: x * colWidth, y: index * rowHeight }
  })

  return (
    <div style={{ position: 'relative', display: 'flex' }}>
      {/* SVG Overlay for Graph */}
      <svg
        width={nextBranchX * colWidth}
        height={commits.length * rowHeight}
        style={{ position: 'absolute', left: 0 }}
      >
        {/* Draw Connections */}
        {positionedCommits.map((commit) =>
          commit.parents.map((parent) => {
            const parentNode = positionedCommits.find((c) => c.hash === parent)
            if (!parentNode) return null
            return (
              <line
                key={`${commit.hash}-${parent}`}
                x1={commit.x + 5}
                y1={commit.y + 5}
                x2={parentNode.x + 5}
                y2={parentNode.y + 5}
                stroke="black"
              />
            )
          })
        )}

        {/* Draw Commit Nodes */}
        {positionedCommits.map((commit) => (
          <circle
            key={commit.hash}
            cx={commit.x + 5}
            cy={commit.y + 5}
            r={5}
            fill="black"
          />
        ))}
      </svg>

      {/* Table for Commit Info */}
      <table style={{ marginLeft: nextBranchX * colWidth + 20 }}>
        <tbody>
        {commits.map((commit) => (
          <tr key={commit.hash}>
            <td>{commit.hash}</td>
            <td>{commit.message}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}