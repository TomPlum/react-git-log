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