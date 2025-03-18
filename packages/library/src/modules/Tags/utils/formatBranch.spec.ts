import { formatBranch } from './formatBranch'

describe('formatBranch', () => {
  it('should strip the remote origin refs', () => {
    const branchName = 'refs/remotes/origin/develop'
    const formattedBranch = formatBranch(branchName)
    expect(formattedBranch).toStrictEqual('develop')
  })

  it('should strip the heads refs', () => {
    const branchName = 'refs/heads/renovate/major-react-monorepo'
    const formattedBranch = formatBranch(branchName)
    expect(formattedBranch).toStrictEqual('renovate/major-react-monorepo')
  })

  it('should strip the tags refs', () => {
    const branchName = 'refs/tags/v2.4.0'
    const formattedBranch = formatBranch(branchName)
    expect(formattedBranch).toStrictEqual('v2.4.0')
  })
})