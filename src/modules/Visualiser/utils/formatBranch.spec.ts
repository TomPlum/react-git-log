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
})