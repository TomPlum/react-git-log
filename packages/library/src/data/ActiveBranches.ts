export class ActiveBranches {
  /**
   * Tracks the commit hashes that are active
   * at any one time. The index in the array
   * is the position (like the column in the graph).
   */
  private branches: (string | null)[] = ['index']

  /**
   * Adds a commit hash to the active branches.
   *
   * @param index The position to add the commit hash at.
   * @param hash The hash of the commit.
   */
  public setHash(index: number, hash: string) {
    this.branches[index] = hash
  }

  /**
   * Removes a commit hash from the active branches.
   *
   * @param index The position to remove the commit hash from.
   */
  public removeHash(index: number) {
    this.branches[index] = null
  }

  /**
   * Inserts a commit into the nearest available column in the visualisation.
   *
   * @param hash The SHA1 hash of the commit we're inserting.
   * @param columnIndex The initial index of the column where we want to place the commit.
   * @param forbiddenIndices A set of indices where the commit cannot be placed.
   */
  public insertCommit(hash: string, columnIndex: number, forbiddenIndices: Set<number>) {
    // How far we're going to try searching from the initial column index
    let columnDelta = 1

    // While there are still available positions to the left or right...
    while (columnIndex - columnDelta >= 0 || columnIndex + columnDelta < this.branches.length) {
      const isRightForbidden = forbiddenIndices.has(columnIndex + columnDelta)
      const isRightEmpty = this.branches[columnIndex + columnDelta] === null

      // Check if we can place the commit on the right-hand side
      if (columnIndex + columnDelta < this.branches.length && isRightEmpty && !isRightForbidden) {
        this.branches[columnIndex + columnDelta] = hash
        return columnIndex + columnDelta // Place to the right
      }

      const isLeftForbidden = forbiddenIndices.has(columnIndex - columnDelta)
      const isLeftEmpty = this.branches[columnIndex - columnDelta] === null

      // If not, check the left-hand side
      if (columnIndex - columnDelta >= 0 && isLeftEmpty && !isLeftForbidden) {
        this.branches[columnIndex - columnDelta] = hash
        return columnIndex - columnDelta // Place to the left
      }

      columnDelta++
    }

    this.branches.push(hash)

    return this.branches.length - 1
  }

  public get length() {
    return this.branches.length
  }
}