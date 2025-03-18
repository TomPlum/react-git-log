Git Log Visualiser

A git log with graph component for React.

> [!WARNING]
> This package is currently in active development. It may contain bugs or performance issues and is not "officially" ready for consumption yet.

# Git Commands

Extract data from a given `<branch>`.
```bash
git log <branch> --pretty=format:hash:%h,parents:%p,branch:%S,refs:%d,msg:%s,cdate:%cd,adate:%ad' --date=iso
```

Extract data from all branches.
```bash
git log --all --pretty=format:'hash:%h,parents:%p,branch:%S,refs:%d,msg:%s,cdate:%cd,adate:%ad' --date=iso >> git-log-all.txt
```

# Component Props

## Required

TODO: Add table

## Optional

TODO: Add table

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