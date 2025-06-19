import { parseGitLogOutput } from 'test/data/gitLogParser'
import { render } from '@testing-library/react'
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
      >
        <GitLogPaged.Tags />
        <GitLogPaged.GraphHTMLGrid />
        <GitLogPaged.Table />
      </GitLogPaged>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should log a warning if the graph subcomponent is not rendered', () => {
    const consoleWarn = vi.spyOn(console, 'warn')

    render(
      <GitLogPaged
        entries={[]}
        branchName='main'
        headCommitHash='123'
      />
    )

    expect(consoleWarn).toHaveBeenCalledExactlyOnceWith(
      'react-git-log is not designed to work without a <GitLogPaged.GraphCanvas2D /> or a <GitLogPaged.GraphHTMLGrid /> component.'
    )
  })

  it('should throw an error if the tags subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash='123'
        >
          <GitLogPaged.Tags />
          <GitLogPaged.Tags />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.Tags /> child.'
    )
  })

  it('should throw an error if the table subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash='123'
        >
          <GitLogPaged.Table />
          <GitLogPaged.Table />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.Table /> child.'
    )
  })

  it('should throw an error if the HTML grid graph subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash='123'
        >
          <GitLogPaged.GraphHTMLGrid />
          <GitLogPaged.GraphHTMLGrid />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.GraphHTMLGrid /> child.'
    )
  })

  it('should throw an error if the canvas graph subcomponent is rendered twice', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash='123'
        >
          <GitLogPaged.GraphCanvas2D />
          <GitLogPaged.GraphCanvas2D />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.GraphCanvas2D /> child.'
    )
  })

  it('should throw an error if the graph subcomponent is rendered twice with different variants', () => {
    const renderBadComponent = () => {
      render(
        <GitLogPaged
          entries={[]}
          branchName='main'
          headCommitHash='123'
        >
          <GitLogPaged.GraphCanvas2D />
          <GitLogPaged.GraphHTMLGrid />
        </GitLogPaged>
      )
    }

    expect(renderBadComponent).toThrow(
      '<GitLogPaged /> can only have one <GitLogPaged.GraphHTMLGrid /> or <GitLogPaged.GraphCanvas2D /> child.'
    )
  })
})