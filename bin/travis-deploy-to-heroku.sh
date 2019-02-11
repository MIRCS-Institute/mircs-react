#!/bin/bash -ev

#
# Deploys contents of build dir to Heroku.
#

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $__dirname/..

HEROKU_APP_NAME=$1

echo 'heroku git:clone -a ${HEROKU_APP_NAME}'
heroku git:clone -a ${HEROKU_APP_NAME}

echo 'ls ${HEROKU_APP_NAME}/.git'
ls ${HEROKU_APP_NAME}/.git

./bin/prepare-deploy.sh

# convert the build folder into a Heroku git folder
mv ${HEROKU_APP_NAME}/.git build

cd build

if [ -z "$(git status --porcelain)" ]; then
  echo "build directory clean is clean, skipping Heroku deploy."
else
  # Uncommitted changes
  git add .
  git commit -m "Travis Build - Commit:${TRAVIS_COMMIT} ${TRAVIS_COMMIT_MESSAGE}"
  git push heroku master
fi
