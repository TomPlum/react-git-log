/**
 * Represents a commit in the Git history.
 */
export interface Commit {
  /**
   * The unique hash (SHA) identifying the commit.
   */
  hash: string

  /**
   * An array of parent commit hashes (SHA) for this commit.
   * A commit can have multiple parents in the case of merges.
   */
  parents: string[]

  /**
   * An array of child commit hashes (SHA) that
   * reference this commit as a parent.
   *
   * This helps track descendants in the commit graph.
   */
  children: string[]

  /**
   * The name of the branch this commit belongs to.
   */
  branch: string

  /**
   * The commit message describing the changes
   * introduced by this commit.
   */
  message: string

  /**
   * Details of the user who authored
   * the commit.
   */
  author?: CommitAuthor

  /**
   * The date and time when the commit was
   * made by the author, in ISO 8601 format.
   */
  authorDate?: string

  /**
   * The date and time when the commit was
   * committed to the repository, in ISO 8601 format.
   *
   * This may differ from `authorDate` in cases
   * like rebases or amend commits.
   */
  committerDate: string

  /**
   * Indicates whether this commit is the
   * tip (latest commit) of its branch.
   */
  isBranchTip: boolean
}

/**
 * Represents the author of a Git commit.
 */
export interface CommitAuthor {
  /**
   * The name of the commit author.
   */
  name?: string;

  /**
   * The email address of the commit author.
   */
  email?: string;
}