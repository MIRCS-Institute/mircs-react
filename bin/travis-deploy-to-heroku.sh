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
git add .
git commit -m "Travis Build - Commit:${TRAVIS_COMMIT} ${TRAVIS_COMMIT_MESSAGE}"

git remote add heroku https://:${HEROKU_API_KEY}@git.heroku.com/${HEROKU_APP_NAME}.git
git pull heroku master
git rebase heroku/master
git push heroku master
