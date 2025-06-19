import { describe, expect, it } from 'vitest'
import { parseGitLogOutput } from './gitLogParser'

describe('gitLogParser', () => {
  it('parses valid git log output', () => {
    const input = `
  hash:2079fb6,parents:1352f4c,branch:refs/remotes/origin/renovate/all-minor-patch,msg:fix(deps): update all non-major dependencies,cdate:2025-03-24 17:03:58 +0000,adate:2025-03-24 17:03:58 +0000,author:renovate[bot],email:29139614+renovate[bot]@users.noreply.github.com
hash:c88f0b9,parents:786b044,branch:refs/heads/develop,msg:feat(highlights): cleaned up effect function,cdate:2025-03-07 20:42:31 +0000,adate:2025-03-07 20:42:31 +0000,author:Thomas Plumpton,email:Thomas.Plumpton@hotmail.co.uk
 `

    const result = parseGitLogOutput(input.trim())

    expect(result).toEqual([
      {
        hash: '2079fb6',
        parents: ['1352f4c'],
        branch: 'refs/remotes/origin/renovate/all-minor-patch',
        message: 'fix(deps): update all non-major dependencies',
        committerDate: '2025-03-24 17:03:58 +0000',
        authorDate: '2025-03-24 17:03:58 +0000',
        author: {
          email: '29139614+renovate[bot]@users.noreply.github.com',
          name: 'renovate[bot]',
        },
      },
      {
        hash: 'c88f0b9',
        parents: ['786b044'],
        branch: 'refs/heads/develop',
        message: 'feat(highlights): cleaned up effect function',
        committerDate: '2025-03-07 20:42:31 +0000',
        authorDate: '2025-03-07 20:42:31 +0000',
        author: {
          email: 'Thomas.Plumpton@hotmail.co.uk',
          name: 'Thomas Plumpton',
        },
      }
    ])
  })

  it('returns an empty array when input is empty', () => {
    expect(parseGitLogOutput('')).toEqual([])
  })
})