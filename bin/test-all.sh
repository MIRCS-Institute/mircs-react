#!/bin/bash -ex

#
# Runs automated tests for projects.
#

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $__dirname/..

echo "-- run server tests"
(cd server && npm run lint && ENV=test npm test)

echo "-- run react-app tests"
(cd react-app && npm run lint && CI=true ENV=test npm test)
