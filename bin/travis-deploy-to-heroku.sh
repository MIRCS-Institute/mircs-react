#!/bin/bash -ev

#
# Deploys contents of build dir to Heroku.
#

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $__dirname/..

HEROKU_APP_NAME=$1

./bin/prepare-deploy.sh

cd build

git init
heroku git:remote -a ${HEROKU_APP_NAME}
git add .
git commit -m "Travis Build - Commit:${TRAVIS_COMMIT} ${TRAVIS_COMMIT_MESSAGE}"
git push heroku master
