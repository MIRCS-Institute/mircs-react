#!/bin/bash -ex

#
# Builds web app and server into build directory.
#

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $__dirname/..

(cd react-app && npm run build)

rm -rf build
cp -R server build
cp -R react-app/build build/public

# remove non-production resources
rm -f build/README.md
rm -rf build/bin
