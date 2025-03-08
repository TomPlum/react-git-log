import { buildGraph } from 'modules/Visualiser/utils/buildGraph'
import { GitLogEntry } from 'modules/Visualiser'

const commit = ({ id, parents }: { id: number | string, parents?: (number | string)[] }): GitLogEntry => ({
  hash: id.toString(),
  message: `commit-${id}`,
  parents: parents ? parents.map(it => it.toString()) : [],
  refs: '',
  date: '',
  branch: 'test'
})

const node = ({ id, x, y, parents }: { id: number | string, parents?: (number | string)[], x: number, y: number }) => ({
  ...commit({ id, parents }), x, y
})

describe.skip('buildGraph', () => {
  it('should build a linear history graph', () => {
    const rowHeight = 30

    const graph = buildGraph([
      commit({ id: 1 }),
      commit({ id: 2, parents: [1] }),
      commit({ id: 3, parents: [2] })
    ], rowHeight)

    expect(graph).toStrictEqual([
      node({ id: 1, x: 0, y: 0 }),
      node({ id: 2, parents: [1], x: 0, y: 30 }),
      node({ id: 3, parents: [2], x: 0, y: 60 })
    ])
  })

  it('should build a graph with a branch', () => {
    const rowHeight = 30

    /**
     * main --> main-commit-2
     *  |
     * feature/foo --> feature/foo-commit2
     */
    const graph = buildGraph([
      commit({ id: 'main' }),
      commit({ id: 'main-commit-2', parents: ['main'] }),
      commit({ id: 'feature/foo', parents: ['main'] }),
      commit({ id: 'feature/foo-commit-2', parents: ['feature/foo'] })
    ], rowHeight)

    expect(graph).toStrictEqual([
      node({ id: 'main', x: 0, y: 0 }),
      node({ id: 'main-commit-2', parents: ['main'], x: 0, y: 30 }),
      node({ id: 'feature/foo', parents: ['main'], x: 1, y: 30 }),
      node({ id: 'feature/foo-commit-2', parents: ['feature/foo'], x: 1, y: 60 })
    ])
  })
})