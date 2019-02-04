#!/bin/bash -e

#
# Deletes node_modules in project directories.
#

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $__dirname/..

echo "-- delete server dependencies"
(cd server && time rm -rf node_modules)

echo "-- delete react-app dependencies"
(cd react-app && time rm -rf node_modules)
