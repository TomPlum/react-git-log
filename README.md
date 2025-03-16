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

TODO:
- Pagination
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