import { Commit } from 'types'

export const commit = (commit?: Partial<Commit>) => ({
  hash: 'aa2c148',
  committerDate: '2025-02-24T22:06:22+00:00',
  authorDate: '2025-02-22 22:06:22 +0000',
  message: 'feat(graph): example commit message',
  parents: [
    'afdb263'
  ],
  branch: 'refs/remotes/origin/gh-pages',
  children: [
    '30ee0ba'
  ],
  isBranchTip: false,
  ...commit
})