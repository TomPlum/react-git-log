import FastPriorityQueue from 'fastpriorityqueue'

export class ActiveNodes {
  private readonly activeNodes = new Map<string, Set<number>>()
  private readonly activeNodesQueue = new FastPriorityQueue<[number, string]>((lhs, rhs) => lhs[0] < rhs[0])

  constructor() {
    this.activeNodes.set('index', new Set<number>())
  }

  public removeOutdatedNodes(rowIndex: number) {
    while (!this.activeNodesQueue.isEmpty() && this.activeNodesQueue.peek()![0] < rowIndex) {
      const activeNodeHash = this.activeNodesQueue.poll()![1]
      this.activeNodes.delete(activeNodeHash)
    }
  }

  public initialiseNewColumn(hash: string) {
    this.activeNodes.set(hash, new Set<number>())
  }

  public update(columnValues: number[]) {
    this.activeNodes.forEach(activeNode => {
      columnValues.forEach(columnValue => {
        activeNode.add(columnValue)
      })
    })
  }

  public enqueue(value: [number, string]) {
    this.activeNodesQueue.add(value)
  }

  public get(hash: string) {
    return this.activeNodes.get(hash)!
  }
}