#!/bin/bash -x

# exit on first non-zero exit code
set -e

# build optimized react-app
(cd ../react-app; npm run build)
# move build output to ./public
rm -rf ./public
mv ../react-app/build ./public

# deploy to google cloud - interactive
gcloud app deploy
