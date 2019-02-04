#!/bin/bash -e

#
# Runs `npm install` in project directories.
#

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $__dirname/..

echo "-- install server dependencies"
(cd server && time npm install --no-spin --no-progress)

echo "-- install react-app dependencies"
(cd react-app && time npm install --no-spin --no-progress)
