export const formatBranch = (branchName: string) => {
  return branchName
    .replace('refs/heads/', '')
    .replace('refs/remotes/origin/', '')
    .replace('refs/tags/', '')
}