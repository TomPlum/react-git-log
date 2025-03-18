# :seedling: Git Log Visualiser

A flexible and interactive React component for visualising Git commit history. Displays a branching graph alongside commit, branch and tag metadata, with support for customised theming.

> [!WARNING]
> This package is currently in active development. It may contain bugs or performance issues and is not "officially" ready for consumption yet.


# Features

- :seedling: Responsive commit history graph
- :memo: Table with commit message and date
- :bookmark: Branch and tagging information

# Git Log Data

The array of `GitLogEntry` objects is the source of data used by the `GitLog` component. It has the following properties:

| Property        | Type       | Description                                                                                                                                   |
|-----------------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `hash`          | `string`   | The unique hash identifier of the commit.                                                                                                     |
| `branch`        | `string`   | The name of the branch this commit belongs to.                                                                                                |
| `parents`       | `string[]` | An array of parent commit hashes. If this is a merge commit, it will have multiple parents. If it's an initial commit, it will have none.     |
| `message`       | `string`   | The commit message describing the changes made in this commit.                                                                                |
| `committerDate` | `string`   | The date and time when the commit was applied by the committer. Typically the timestamp when the commit was finalized.                        |
| `authorDate`    | `string?`  | *(Optional)* The date and time when the commit was originally authored. May differ from `committerDate` if the commit was rebased or amended. |

Usually you'd be sourcing this data from a backend service like a web-api, but you can extract it from the command line with the following command:

```bash
git log --all --pretty=format:'hash:%h,parents:%p,branch:%S,refs:%d,msg:%s,cdate:%cd,adate:%ad' --date=iso >> git-log.txt
```

This will write `git-log.txt` in the directory where you ran the command. It can be passed to the `parseGitLog.ts` function from the library to produce an array of `GitLogEntry`.

# Component Props

## Required

| Prop                          | Type                        | Description                                                                                                                                 |
|-------------------------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `entries`                     | `GitLogEntry[]`             | The git log entries to visualize on the graph.                                                                                              |
| `currentBranch`               | `string`                    | The name of the branch that is currently checked out.                                                                                       |

## Optional

| Prop                          | Type                        | Description                                                                                                                                 |
|-------------------------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `theme`                       | `ThemeMode`                 | The variant of the default color theme to apply to the log.                                                                                 |
| `colours`                     | `ThemeColours \| string[]`  | An array of colors used to color the log elements such as the graph. If not enough colors are provided, they will loop back from the start. |
| `showBranchesTags`            | `boolean`                   | Whether to show labels for nodes that are the tips of branches or tags in the graph.                                                        |
| `showGitLog`                  | `boolean`                   | Whether to show a table of commit metadata on the right-hand side of the graph.                                                             |
| `showCommitNodeHashes`        | `boolean`                   | Whether to show the commit hash next to the node in the graph.                                                                              |
| `showCommitNodeTooltips`      | `boolean`                   | Whether to show tooltips when hovering over a commit node in the graph.                                                                     |
| `showTableHeaders`            | `boolean`                   | Whether to show the names of the elements at the top of the component (e.g., "Graph", "Commit message").                                    |
| `enableExperimentalAnimation` | `boolean`                   | Enables Framer Motion animation for simple fading transitions. Experimental feature.                                                        |
| `enableResize`                | `boolean`                   | Enables the graph's horizontal width to be resized. (Default: `false`)                                                                      |
| `rowSpacing`                  | `number`                    | The spacing between the rows of the log, affecting all elements across branches, graph, and table. (Default: `0`)                           |
| `githubRepositoryUrl`         | `string`                    | A link to the GitHub repository from which the log entries came. Enables links for commits, tags, and PRs.                                  |
| `defaultGraphContainerWidth`  | `number`                    | The default width of the graph in pixels. (Default: `300`)                                                                                  |
| `timestampFormat`             | `string`                    | A timestamp format string passed to DayJS to format commit timestamps. (Default: `ISO-8601`)                                                |
| `onSelectCommit`              | `(commit?: Commit) => void` | A callback function invoked when a commit is selected or unselected.                                                                        |
| `classes`                     | `GitLogStylingProps`        | CSS classes for various underlying elements for custom styling.                                                                             |
| `paging`                      | `GitLogPaging`              | Optional paging information to show a window of the given size from the set of git log entries.                                             |

### GitLogStylingProps

| Prop              | Type                                                                                        | Description                                             |
|-------------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------|
| `containerClass`  | `string`                                                                                    | A class name for the wrapping container around the log. |
| `containerStyles` | `CSSProperties`                                                                             | A React CSS styling object for the wrapping container.  |
| `logTableClass`   | `string`                                                                                    | A class name for the table element in the git log.      |
| `logTableStyles`  | `{ table?: CSSProperties; thead?: CSSProperties; tr?: CSSProperties; td?: CSSProperties; }` | A React CSS styling object for the git log table.       |

### GitLogPaging

| Prop   | Type     | Description                                     |
|--------|----------|-------------------------------------------------|
| `size` | `number` | The number of rows to show per page.            |
| `page` | `number` | The page number to display (first page is `0`). |

# References
- https://pvigier.github.io/2019/05/06/commit-graph-drawing-algorithms.html
- https://github.com/pvigier/gitamine
- https://marklodato.github.io/visual-git-guide/index-en.html
- https://github.com/i-e-b/SnivellingGit/tree/master

# TODO:
- Filtering of branches
- Filter by commit message search?
- Filtering of date?
- Show code in stories
- Tests
- Expose custom theme object off the Theme type
- Performance testing on large repos
- Can Zustand help us here to reduce re-renders with GitContext Provider?
- Add error boundary
- Add empty state
- Expose component override props for things like CommitNode, CommitMessage etc.
- Improve node tooltip contents, embolden labels
- Make table more responsive, remove 500px message max-width
- Straight line prop to turn curves into right angles?
- Move repo selection to the story component instead of being a control (also add theme/colour dropdown here too)
- Add data-testids to all relevant elements for testing
- Row alignment in table is off in Chrome. So is Storybook colours/formatting.
- Rewrite the table with standard div elements
- Split computeNodeFunctions up
- Add LICENSE
- Node size parameter to make the graph even more compact as it will reduce the minimum column width
- Line curve radius prop?
- Should we split the component in 3 sub-components with a wrapper, like `GitLog` and `GitLog.Graph` etc.?
- Fix React docgen in Storybook controls as its not showing the JSDoc from the interface props
- showTableHeaders: false breaks new table spacing