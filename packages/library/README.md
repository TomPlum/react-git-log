![GitHub Release](https://img.shields.io/github/v/release/TomPlum/react-git-log?style=for-the-badge&logo=github&color=green)
![NPM Type Definitions](https://img.shields.io/npm/types/%40tomplum%2Freact-git-log?style=for-the-badge&logo=typescript)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40tomplum%2Freact-git-log?style=for-the-badge&logo=vite&color=gold&logoColor=gold)

# :seedling: React Git Log

A flexible and interactive React component for visualising Git commit history. Displays a branching graph alongside commit, branch and tag metadata, with support for customised theming.

# Contents
<!-- TOC -->
* [:seedling: React Git Log](#seedling-react-git-log)
* [Contents](#contents)
* [Features](#features)
* [Using the component](#using-the-component)
* [Git Log Data](#git-log-data)
* [Component Props](#component-props)
  * [Required](#required)
      * [GitLog](#gitlog)
      * [GitLogPaged](#gitlogpaged)
  * [Optional](#optional)
    * [GitLog](#gitlog-1)
    * [GitLogPaged](#gitlogpaged-1)
      * [GitLogStylingProps](#gitlogstylingprops)
      * [GitLogPaging](#gitlogpaging)
      * [GitLogIndexStatus](#gitlogindexstatus)
      * [GitLogUrlBuilder](#gitlogurlbuilder)
    * [GraphHTMLGrid](#graphhtmlgrid)
    * [GraphCanvas2D](#graphcanvas2d)
      * [NodeTheme](#nodetheme)
    * [Table](#table)
      * [GitLogTableStylingProps](#gitlogtablestylingprops)
      * [CustomTableRow](#customtablerow)
      * [CustomCommitNode](#customcommitnode)
<!-- TOC -->

# Features

- :seedling: Responsive commit history graph
- :memo: Table with commit message and date
- :bookmark: Branch and tagging information
- :art: Custom theming API
- :waning_crescent_moon: Dark and light modes

# Using the component

1. Install the package using your preferred package manager.

   Using npm
    ```shell
    npm install @tomplum/react-git-log
    ```

   Using yarn
    ```shell
    yarn add @tomplum/react-git-log
    ```

   Using pnpm
    ```shell
    pnpm add @tomplum/react-git-log
    ```

2. Make sure that `react` and `react-dom` are installed in your project, as they are peer dependencies.

   ```shell
   npm install react react-dom
   ```

3. Render the component in your application.

   The core `<GitLog />` component is using the [compound component pattern](https://www.patterns.dev/react/compound-pattern/) and must be rendered around the subcomponents you wish to render.
   <br><br>
   Below is an example component, `YourConsumer.tsx`, that is using `<GitLog />` with all three available subcomponents and only the required props.
   <br><br>
   See the [required](#required) component props to get started and the [optional](#optional) props for further configuration and theming.

    ```typescript jsx
    import { GitLog } from "@tomplum/react-git-log"
    
    const YourConsumer = () => {
      const { entries, currentBranch } = useYourDataSource()
      
      return (
        <GitLog entries={entries} currentBranch={currentBranch}>
          <GitLog.Tags />
          <GitLog.GraphCanvas2D />
          <GitLog.Table />
        </GitLog>
      )
    }
    ```

   Below is another example that is passing in optional props to configure the log. See the [optional](#optional) props for further configuration and theming.

    ```typescript jsx
    import styles from './YourConsumer.module.scss'
    import { GitLog } from "@tomplum/react-git-log"
    
    const YourConsumer = () => {
      const { entries, currentBranch } = useYourDataSource()
      
      return (
        <GitLog entries={entries} currentBranch={currentBranch}>
          <GitLog.Tags />
   
          <GitLog.GraphHTMLGrid
            enableResize           
            nodeTheme='plain'
            showCommitNodeTooltips
          />
   
          <GitLog.Table
            className={styles.table}
            timestampFormat='YYYY MM dd'
          />
        </GitLog>
      )
    }
    ```

# Git Log Data

The array of `GitLogEntry` objects is the source of data used by the `GitLog` component. It has the following properties:

| Property        | Type            | Description                                                                                                                                   |
|-----------------|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `hash`          | `string`        | The unique hash identifier of the commit.                                                                                                     |
| `branch`        | `string`        | The name of the branch this commit belongs to.                                                                                                |
| `parents`       | `string[]`      | An array of parent commit hashes. If this is a merge commit, it will have multiple parents. If it's an initial commit, it will have none.     |
| `message`       | `string`        | The commit message describing the changes made in this commit.                                                                                |
| `author`        | `CommitAuthor?` | Details of the user who authored the commit.                                                                                                  |
| `committerDate` | `string`        | The date and time when the commit was applied by the committer. Typically the timestamp when the commit was finalized.                        |
| `authorDate`    | `string?`       | *(Optional)* The date and time when the commit was originally authored. May differ from `committerDate` if the commit was rebased or amended. |

> [!TIP]
> Usually you'd be sourcing this data from a backend service like a web-api, but you can extract it from the command line with the following command.

```bash
# For the entire Git log history across all branches
git log --all --pretty=format:'hash:%h,parents:%p,branch:%S,msg:%s,cdate:%cd,adate:%ad,author:%an,email:%ae' --date=iso >> git-log-all.txt

# For the entire Git log history on a given <branch-name>
git log <branch-name> --pretty=format:'hash:%h,parents:%p,branch:%S,msg:%s,cdate:%cd,adate:%ad,author:%an,email:%ae' --date=iso >> git-log.txt
```

This will write `git-log.txt` or `git-log-all.txt` in the directory where you ran the command. It can be passed to the `parseGitLog.ts` function from the library to produce an array of `GitLogEntry`.

# Component Props

## Required

Only the core parent components have required props.

#### GitLog

| Prop            | Type            | Description                                           |
|-----------------|-----------------|-------------------------------------------------------|
| `entries`       | `GitLogEntry[]` | The git log entries to visualize on the graph.        |
| `currentBranch` | `string`        | The name of the branch that is currently checked out. |

#### GitLogPaged

| Prop             | Type            | Description                                              |
|------------------|-----------------|----------------------------------------------------------|
| `entries`        | `GitLogEntry[]` | The git log entries to visualize on the graph.           |
| `branchName`     | `string`        | The name of the branch whose entries are being rendered. |
| `headCommitHash` | `string`        | The SHA1 commit hash of the HEAD commit of the branch.   |

## Optional

All components have optional props to further configure the log.

### GitLog

| Property            | Type                        | Description                                                                                                 |
|---------------------|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `theme`             | `ThemeMode`                 | The variant of the default color theme to apply to the log.                                                 |
| `colours`           | `ThemeColours \| string[]`  | Array of colors used for graph elements. One per column, looping if insufficient colors are provided.       |
| `showHeaders`       | `boolean`                   | Whether to show element names like "Graph" or "Commit message" at the top of the component.                 |
| `rowSpacing`        | `number`                    | The spacing between log rows, affecting branches, graph, and table. Default: `0`.                           |
| `urls`              | `GitLogUrlBuilder`          | A function that returns built URLs to the remote Git provider. Enables links for commits, tags, and PRs.    |
| `defaultGraphWidth` | `number`                    | Default width of the graph in pixels. Can be changed dynamically if resizing is enabled. Default: `300`.    |
| `onSelectCommit`    | `(commit?: Commit) => void` | Callback function when a commit is selected (clicked). `commit` is `undefined` if unselected.               |
| `onPreviewCommit`   | `(commit?: Commit) => void` | Callback function when a commit is previewed (hovered). `commit` is `undefined` if stopped being previewed. |
| `classes`           | `GitLogStylingProps`        | CSS classes for various elements to enable custom styling.                                                  |
| `paging`            | `GitLogPaging`              | Optional paging settings for displaying a subset of log entries.                                            |
| `indexStatus`       | `GitLogIndexStatus`         | Renders information about added, deleted and modified files to the index pseudo-commit entry.               |
| `showGitIndex`      | `boolean`                   | Enables the Git index "pseudo-commit' entry above the HEAD commit.                                          |

### GitLogPaged

| Property              | Type                        | Description                                                                                                 |
|-----------------------|-----------------------------|-------------------------------------------------------------------------------------------------------------|
| `theme`               | `ThemeMode`                 | The variant of the default color theme to apply to the log.                                                 |
| `colours`             | `ThemeColours \| string[]`  | Array of colors used for graph elements. One per column, looping if insufficient colors are provided.       |
| `showHeaders`         | `boolean`                   | Whether to show element names like "Graph" or "Commit message" at the top of the component.                 |
| `rowSpacing`          | `number`                    | The spacing between log rows, affecting branches, graph, and table. Default: `0`.                           |
| `urls`                | `GitLogUrlBuilder`          | A function that returns built URLs to the remote Git provider. Enables links for commits, tags, and PRs.    |
| `defaultGraphWidth`   | `number`                    | Default width of the graph in pixels. Can be changed dynamically if resizing is enabled. Default: `300`.    |
| `onSelectCommit`      | `(commit?: Commit) => void` | Callback function when a commit is selected (clicked). `commit` is `undefined` if unselected.               |
| `onPreviewCommit`     | `(commit?: Commit) => void` | Callback function when a commit is previewed (hovered). `commit` is `undefined` if stopped being previewed. |
| `classes`             | `GitLogStylingProps`        | CSS classes for various elements to enable custom styling.                                                  |
| `indexStatus`         | `GitLogIndexStatus`         | Renders information about added, deleted and modified files to the index pseudo-commit entry.               |
| `showGitIndex`        | `boolean`                   | Enables the Git index "pseudo-commit' entry above the HEAD commit.                                          |


#### GitLogStylingProps
| Property          | Type            | Description                                                                    |
|-------------------|-----------------|--------------------------------------------------------------------------------|
| `containerClass`  | `string`        | Class name for the wrapping `<div>` containing branches, graph, and log table. |
| `containerStyles` | `CSSProperties` | React CSS styling object for the wrapping container `<div>`.                   |

#### GitLogPaging

| Prop   | Type     | Description                                     |
|--------|----------|-------------------------------------------------|
| `size` | `number` | The number of rows to show per page.            |
| `page` | `number` | The page number to display (first page is `0`). |

#### GitLogIndexStatus

| Prop       | Type     | Description                                                               |
|------------|----------|---------------------------------------------------------------------------|
| `added`    | `number` | The number of added files in the git index for the checked-out branch.    |
| `deleted`  | `number` | The number of deleted files in the git index for the checked-out branch.  |
| `modified` | `number` | The number of modified files in the git index for the checked-out branch. |

#### GitLogUrlBuilder

A function with the following signature
```typescript
type GitLogUrlBuilder = (args: GitLogUrlBuilderArgs) => GitLogUrls
```
Returns an object of type `GitLogUrls` with the following fields.

| Prop       | Type     | Description                                                                              |
|------------|----------|------------------------------------------------------------------------------------------|
| `commit`   | `string` | A resolved URL to a particular commit hash on the external Git providers remote website. |
| `branch`   | `string` | A resolved URL to a branch on the external Git providers remote website.                 |

### GraphHTMLGrid

| Property                      | Type                | Description                                                                                                    |
|-------------------------------|---------------------|----------------------------------------------------------------------------------------------------------------|
| `showCommitNodeHashes`        | `boolean`           | Whether to show the commit hash next to nodes in the graph.                                                    |
| `showCommitNodeTooltips`      | `boolean`           | Whether to show tooltips when hovering over a commit node.                                                     |
| `nodeTheme`                   | `NodeTheme`         | Theme applied to commit node elements in the graph.                                                            |
| `nodeSize`                    | `number`            | The diameter, in pixels, of the commits nodes. Should be divisible by 2 and between 8 and 30 to render nicely. |
| `orientation`                 | `normal \| flipped` | The orientation of the graph. Normal renders the checked-out branch on the left, flipped on the right.         |
| `enableResize`                | `boolean`           | Enables horizontal resizing of the graph. Default: `false`.                                                    |
| `highlightedBackgroundHeight` | `number`            | The height, in pixels, of the background colour of a row that is being previewed or has been selected.         |
| `node`                        | `CustomCommitNode`  | A function that returns a custom commit node implementation used by the graph. See [here](#customcommitnode).  |

### GraphCanvas2D

| Property                 | Type                | Description                                                                                                    |
|--------------------------|---------------------|----------------------------------------------------------------------------------------------------------------|
| `nodeTheme`              | `NodeTheme`         | Theme applied to commit node elements in the graph.                                                            |
| `nodeSize`               | `number`            | The diameter, in pixels, of the commits nodes. Should be divisible by 2 and between 8 and 30 to render nicely. |
| `orientation`            | `normal \| flipped` | The orientation of the graph. Normal renders the checked-out branch on the left, flipped on the right.         |
| `enableResize`           | `boolean`           | Enables horizontal resizing of the graph. Default: `false`.                                                    |

#### NodeTheme

| Prop      | Type     | Description                                                           |
|-----------|----------|-----------------------------------------------------------------------|
| `default` | `string` | The default theme where nodes change their style based on their type. |
| `plain`   | `string` | All nodes look the same, except for their colours.                    |

### Table

| Property          | Type                      | Description                                                                                             |
|-------------------|---------------------------|---------------------------------------------------------------------------------------------------------|
| `timestampFormat` | `string`                  | A timestamp format string for DayJS to format commit timestamps. Default: `ISO-8601`.                   |
| `className`       | `string`                  | A class name for the table's wrapping container.                                                        |
| `styles`          | `GitLogTableStylingProps` | A React CSS styling object for the table elements.                                                      |
| `row`             | `CustomTableRow`          | A function that returns a custom implementation for the table row element. See [here](#customtablerow). |

#### GitLogTableStylingProps

| Property | Type            | Description                             |
|----------|-----------------|-----------------------------------------|
| `table`  | `CSSProperties` | Styles for the table container element. |
| `thead`  | `CSSProperties` | Styles for the table header wrapper.    |
| `tr`     | `CSSProperties` | Styles for each table row.              |
| `td`     | `CSSProperties` | Styles for each table cell.             |

#### CustomTableRow

A function with the following signature:
```typescript
type CustomTableRow = (props: CustomTableRowProps) => ReactElement<HTMLElement>
```

For example:
```typescript jsx
<GitLog.Table
  className={styles.table}
  row={({ commit, backgroundColour }) => (
    <div
      className={styles.CustomRow}
      style={{
        color: theme === 'dark' ? 'white': 'black',
        backgroundColor: backgroundColour
      }}
    >
      <div className={styles.CustomRow__Top}>
        <p className={styles.message}>
          {commit.message}
        </p>
      </div>

      <div className={styles.CustomRow__Bottom}>
        <p>{commit.author?.name}</p>
        <p>#{commit.hash}</p>
      </div>
    </div>
  )}
/>
```

The following properties are injected into the functions `props` argument:

| Property           | Type      | Description                                                           |
|--------------------|-----------|-----------------------------------------------------------------------|
| `commit`           | `Commit`  | Details of the commit belonging to the row.                           |
| `selected`         | `boolean` | Whether the row is selected (has been clicked).                       |
| `previewed`        | `boolean` | Whether the row is previewed (is being hovered over).                 |
| `backgroundColour` | `string`  | The colour of the background as is normally applied to the table row. |

#### CustomCommitNode

A function with the following signature:
```typescript
type CustomCommitNode = (props: CustomCommitNodeProps) => ReactElement
```

For example:
```typescript jsx
 <GitLog.GraphHTMLGrid
  nodeSize={25}
  node={({ nodeSize, colour, isIndexPseudoNode, rowIndex }) => (
    <div
      className={styles.Node}
      style={{
        width: nodeSize,
        height: nodeSize,
        background: `url('https://placecats.com/${images[rowIndex % images.length]}/50/50?fit=contain&position=top') 50% 50%`,
        border: `2px ${isIndexPseudoNode ? 'dotted' : 'solid'} ${colour}`
      }}
    />
  )}
/>
```

The following properties are injected into the functions `props` argument:

| Property            | Type      | Description                                                                                             |
|---------------------|-----------|---------------------------------------------------------------------------------------------------------|
| `commit`            | `Commit`  | Details of the commit that the node is being rendered for.                                              |
| `colour`            | `string`  | The colour of the commit based on the column in its and the theme.                                      |
| `rowIndex`          | `number`  | The (zero-based) index of the row that the node is in.                                                  |
| `columnIndex`       | `number`  | The (zero-based) index of the column that the node is in.                                               |
| `nodeSize`          | `number`  | The diameter (in pixels) of the node. This defaults but can be changed in the graph props.              |
| `isIndexPseudoNode` | `boolean` | Denotes whether the node is the "pseudo node" added above the head to represent the working tree index. |
