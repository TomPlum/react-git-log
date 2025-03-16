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
- Expose row height parameter
- Add error boundary
- Add empty state
- Make App.tsx redundant and create monorepo of lib + demo site
- ESLint / Prettier