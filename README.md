Git Log Visualiser

# Git Commands

Extract data from a given `<branch>`.
```bash
git log <branch> --pretty=format:hash:%h,parents:%p,branch:%S,refs:%d,msg:%s,date:%cd' --date=iso
```

Extract data from all branches.
```bash
git log --all --pretty=format:'hash:%h,parents:%p,branch:%S,refs:%d,msg:%s,date:%cd' --date=iso
```

TODO:
- Pagination
- Filtering of branches
- Filter by commit message search?
- Filtering of date?
- Show code in stories
- Tests
- Fix graph
- Expose custom theme object off the Theme type
- Selected row background colour is overlapping lines as nodeX spacing is too small by default
- The first git tag line is not quite central with the node its connecting to