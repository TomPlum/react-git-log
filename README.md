![NPM Version](https://img.shields.io/npm/v/%40tomplum%2Freact-git-log?style=for-the-badge&logo=npm&color=red&logoColor=red)
![GitHub Release](https://img.shields.io/github/v/release/TomPlum/react-git-log?style=for-the-badge&logo=github&color=green)
![NPM Type Definitions](https://img.shields.io/npm/types/%40tomplum%2Freact-git-log?style=for-the-badge&logo=typescript)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40tomplum%2Freact-git-log?style=for-the-badge&logo=vite&color=gold&logoColor=gold)

# :seedling: React Git Log

A flexible and interactive React component for visualising Git commit history. Displays a branching graph alongside commit, branch and tag metadata, with support for customised theming.

# Contents
<!-- TOC -->
* [Features](#features)
* [Using the component](#using-the-component)
* [Git Log Data](#git-log-data)
* [Component Props](#component-props)
* [Development](#development)
* [References](#references)
* [Roadmap](#roadmap)
<!-- TOC -->

# Features

- :seedling: Responsive commit history graph
- :memo: Table with commit message and date
- :bookmark: Branch and tagging information
- :art: Custom theming API
- :waning_crescent_moon: Dark and light modes

## Pagination

Page a page size and number to render a window of the log. See the [paging](#gitlogpaging) properties for more details.

![pagination.gif](docs/images/pagination.gif)

## Grid System

The implementation of the graph was designed with testing in mind. 
The traditional way to draw such an image would with a HTML `canvas` element. Which, while efficient (and probably easier to implement), is hard to programmatically assert its correctness.

This graph uses a grid system. Each row has N number of columns rendered in it, where N is equal to the maximum number of concurrent active branches in the given git log entry data.
This means that each column is aware of its state and what needs to be drawn (A commit node, vertical line, curved merge line etc.).

Each column is responsive as its row is stretched vertically or horizontally.

![grid-system.gif](docs/images/grid-system.gif)

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
          <GitLog.Graph />
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
   
          <GitLog.Graph
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
git log --all --pretty=format:'hash:%h,parents:%p,branch:%S,msg:%s,cdate:%cd,adate:%ad,author:%an,email:%ae' --date=iso >> git-log.txt
```

This will write `git-log.txt` in the directory where you ran the command. It can be passed to the `parseGitLog.ts` function from the library to produce an array of `GitLogEntry`.

# Component Props

## Required

Only the core `GitLog` parent component has required props.

| Prop            | Type            | Description                                           |
|-----------------|-----------------|-------------------------------------------------------|
| `entries`       | `GitLogEntry[]` | The git log entries to visualize on the graph.        |
| `currentBranch` | `string`        | The name of the branch that is currently checked out. |

## Optional

All components have optional props to further configure the log.

### GitLog

| Property                      | Type                        | Description                                                                                              |
|-------------------------------|-----------------------------|----------------------------------------------------------------------------------------------------------|
| `entries`                     | `GitLogEntry[]`             | The git log entries to visualize on the graph.                                                           |
| `currentBranch`               | `string`                    | The name of the branch that is currently checked out.                                                    |
| `theme`                       | `ThemeMode`                 | The variant of the default color theme to apply to the log.                                              |
| `colours`                     | `ThemeColours \| string[]`  | Array of colors used for graph elements. One per column, looping if insufficient colors are provided.    |
| `showHeaders`                 | `boolean`                   | Whether to show element names like "Graph" or "Commit message" at the top of the component.              |
| `enableExperimentalAnimation` | `boolean`                   | Enables Framer Motion animation for fade transitions. Experimental feature.                              |
| `rowSpacing`                  | `number`                    | The spacing between log rows, affecting branches, graph, and table. Default: `0`.                        |
| `githubRepositoryUrl`         | `string`                    | URL of the GitHub repository where `entries` came from. Enables links for commits, tags, and PRs.        |
| `defaultGraphWidth`           | `number`                    | Default width of the graph in pixels. Can be changed dynamically if resizing is enabled. Default: `300`. |
| `onSelectCommit`              | `(commit?: Commit) => void` | Callback function when a commit is selected. `commit` is `undefined` if unselected.                      |
| `classes`                     | `GitLogStylingProps`        | CSS classes for various elements to enable custom styling.                                               |
| `paging`                      | `GitLogPaging`              | Optional paging settings for displaying a subset of log entries.                                         |


#### **GitLogStylingProps**
| Property          | Type            | Description                                                                    |
|-------------------|-----------------|--------------------------------------------------------------------------------|
| `containerClass`  | `string`        | Class name for the wrapping `<div>` containing branches, graph, and log table. |
| `containerStyles` | `CSSProperties` | React CSS styling object for the wrapping container `<div>`.                   |

#### GitLogPaging

| Prop   | Type     | Description                                     |
|--------|----------|-------------------------------------------------|
| `size` | `number` | The number of rows to show per page.            |
| `page` | `number` | The page number to display (first page is `0`). |

### Graph

| Property                 | Type        | Description                                                 |
|--------------------------|-------------|-------------------------------------------------------------|
| `showCommitNodeHashes`   | `boolean`   | Whether to show the commit hash next to nodes in the graph. |
| `showCommitNodeTooltips` | `boolean`   | Whether to show tooltips when hovering over a commit node.  |
| `nodeTheme`              | `NodeTheme` | Theme applied to commit node elements in the graph.         |
| `enableResize`           | `boolean`   | Enables horizontal resizing of the graph. Default: `false`. |

#### NodeTheme

| Prop      | Type     | Description                                                           |
|-----------|----------|-----------------------------------------------------------------------|
| `default` | `string` | The default theme where nodes change their style based on their type. |
| `plain`   | `string` | All nodes look the same, except for their colours.                    |

### Table

| Property          | Type                      | Description                                                                           |
|-------------------|---------------------------|---------------------------------------------------------------------------------------|
| `timestampFormat` | `string`                  | A timestamp format string for DayJS to format commit timestamps. Default: `ISO-8601`. |
| `className`       | `string`                  | A class name for the table's wrapping container.                                      |
| `styles`          | `GitLogTableStylingProps` | A React CSS styling object for the table elements.                                    |

#### GitLogTableStylingProps

| Property | Type            | Description                             |
|----------|-----------------|-----------------------------------------|
| `table`  | `CSSProperties` | Styles for the table container element. |
| `thead`  | `CSSProperties` | Styles for the table header wrapper.    |
| `tr`     | `CSSProperties` | Styles for each table row.              |
| `td`     | `CSSProperties` | Styles for each table cell.             |

# Development

# References

- Many thanks to Pierre Vigier for his fantastic [blog](https://pvigier.github.io/2019/05/06/commit-graph-drawing-algorithms.html) on Git algorithms and his Electron-based Git client [gitamine](https://github.com/pvigier/gitamine) for help and inspiration.
- This [blog](https://marklodato.github.io/visual-git-guide/index-en.html) by Mark Lodato was useful for graph theory reference.
- And Iain Ballard for his experimental GUI [SnivellingGit](https://github.com/i-e-b/SnivellingGit/tree/master)

# Roadmap
- Show code in stories
- Expose custom theme object off the Theme type
- Performance testing on large repos
- Can Zustand help us here to reduce re-renders with GitContext Provider?
- Add error boundary
- Expose component override props for things like CommitNode, CommitMessage etc.
- Straight line prop to turn curves into right angles?
- Node size parameter to make the graph even more compact as it will reduce the minimum column width
- Line curve radius prop?
- Should we split the component in 3 sub-components with a wrapper, like `GitLog` and `GitLog.Graph` etc.?
- Fix React docgen in Storybook controls as its not showing the JSDoc from the interface props
- Extract ThemeContext
- Mobile responsiveness for the demo site
- Framer motion is basically 90% of the bundle - remove it?