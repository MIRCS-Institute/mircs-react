#!/bin/bash -e

#
# Deploys contents of build dir to Heroku.
#

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $__dirname/..

HEROKU_PROJECT=$1
git clone https://:${HEROKU_AUTH_TOKEN}@git.heroku.com/${HEROKU_PROJECT}.git

./bin/prepare-deploy.sh

mv ${HEROKU_PROJECT}/.git build
cd build
if [ -z "$(git status --porcelain)" ]; then
  echo "build directory clean is clean, skipping Heroku deploy."
else
  # Uncommitted changes
  git add .
  git commit -m "Travis Build - Commit:${TRAVIS_COMMIT} ${TRAVIS_COMMIT_MESSAGE}"
  git push heroku master
fi
