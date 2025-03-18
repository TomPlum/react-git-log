import { describe, expect, it } from 'vitest'
import { parseGitLogOutput } from './gitLogParser'

describe('gitLogParser', () => {
  it('parses valid git log output', () => {
    const input = `
      hash:abc123,parents:def456 ghi789,branch:main,refs:HEAD -> main,msg:Initial commit,date:2025-03-05 12:34:56 +0000
      hash:def456,parents:,branch:feature,refs:,msg:Added feature,date:2025-03-04 11:22:33 +0000
    `

    const result = parseGitLogOutput(input.trim())

    expect(result).toEqual([
      {
        hash: 'abc123',
        parents: ['def456', 'ghi789'],
        branch: 'main',
        refs: 'HEAD -> main',
        message: 'Initial commit',
        date: '2025-03-05 12:34:56 +0000',
      },
      {
        hash: 'def456',
        parents: [],
        branch: 'feature',
        refs: '',
        message: 'Added feature',
        date: '2025-03-04 11:22:33 +0000',
      }
    ])
  })

  it('handles missing optional fields correctly', () => {
    const input = `
      hash:abc123,parents:,branch:,refs:,msg:No branch or refs,date:2025-03-05 12:34:56 +0000
    `

    const result = parseGitLogOutput(input.trim())

    expect(result).toEqual([
      {
        hash: 'abc123',
        parents: [],
        branch: '',
        refs: '',
        message: 'No branch or refs',
        date: '2025-03-05 12:34:56 +0000',
      }
    ])
  })

  it('returns an empty array when input is empty', () => {
    expect(parseGitLogOutput('')).toEqual([])
  })

  it('ignores invalid log lines', () => {
    const input = `
      hash:abc123,parents:def456,branch:main,refs:HEAD,msg:Valid commit,date:2025-03-05 12:34:56 +0000
      invalid log entry
      hash:def456,parents:,branch:feature,refs:,msg:Another commit,date:2025-03-04 11:22:33 +0000
    `

    const result = parseGitLogOutput(input.trim())

    expect(result).toEqual([
      {
        hash: 'abc123',
        parents: ['def456'],
        branch: 'main',
        refs: 'HEAD',
        message: 'Valid commit',
        date: '2025-03-05 12:34:56 +0000',
      },
      {
        hash: 'def456',
        parents: [],
        branch: 'feature',
        refs: '',
        message: 'Another commit',
        date: '2025-03-04 11:22:33 +0000',
      }
    ])
  })
})