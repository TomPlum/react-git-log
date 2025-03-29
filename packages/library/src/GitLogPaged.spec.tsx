import { parseGitLogOutput } from 'test/data/gitLogParser'
import { render } from '@testing-library/react'
// eslint-disable-next-line import/extensions
import sleepRepositoryDataReleaseBranch from 'test/data/sleep-paginated/sleep-release-branch.txt?raw'
import { GitLogPaged } from './GitLogPaged'

describe('GitLogPaged', () => {
  it('should render correctly and match the snapshot the paginated GitLogPaged component', () => {
    const gitLogEntries = parseGitLogOutput(sleepRepositoryDataReleaseBranch).slice(30, 70)

    const { asFragment } = render(
      <GitLogPaged
        showHeaders
        branchName='release'
        headCommitHash='1352f4c'
        entries={gitLogEntries}
        githubRepositoryUrl='https://github.com/TomPlum/sleep'
      >
        <GitLogPaged.Tags />
        <GitLogPaged.Graph />
        <GitLogPaged.Table />
      </GitLogPaged>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})