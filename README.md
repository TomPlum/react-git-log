Git Log Visualiser

# Git Commands

Extract data from a given `<branch>`.
```bash
git log <branch> --pretty=format:hash:%h,parents:%p,branch:%S,refs:%d,msg:%s,cdate:%cd,adate:%ad' --date=iso
```

Extract data from all branches.
```bash
git log --all --pretty=format:'hash:%h,parents:%p,branch:%S,refs:%d,msg:%s,cdate:%cd,adate:%ad' --date=iso >> git-log-all.txt
```

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
- Expose row height parameter
- Add error boundary
- Add empty state
- Make App.tsx redundant and create monorepo of lib + demo site
- ESLint / Prettier
- Expose component override props for things like CommitNode, CommitMessage etc.
- Improve node tooltip contents, embolden labels
- Make table more responsive, remove 500px message max-width
- Fix graph curves. Should maybe have an arc that fits perfectly at minimum width/height, and then when larger, just draws straight lines to the sides
- Straight line prop to turn curves into right angles?