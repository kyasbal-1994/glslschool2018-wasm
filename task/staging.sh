#!/bin/sh
if [ ! -z "$(git status --porcelain)" ]; then
  echo 'Workspace is dirty (Uncommited change is found)'
  return 1
fi
if git branch | grep -w gh-pages > /dev/null 2>&1; then git branch -D gh-pages; fi
git checkout --orphan gh-pages
npm install
npm run clean
npm run build
git ls-files | grep -v -E "^(public|.gitignore$|.envrc$)" | xargs rm -rf
cp -af ./public/* ./
rm -rf ./public
if [ ! -z ${CNAME} ]; then echo -n ${CNAME} > CNAME; fi
