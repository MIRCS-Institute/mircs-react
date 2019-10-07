# MIRCS Geogenealogy

This repository contains the mircs-geogenealogy service prototype, built as a React web app connected to an ExpressJS server backed by MongoDB. For more information on the project see the [MIRCS website](https://www.mircs.ca/geo-genealogy/).

## Build Status

|Branch|Travis CI|
|:-:|:-:|
|develop|[![Build Status](https://travis-ci.org/MIRCS-Institute/mircs-react.svg?branch=develop)](https://travis-ci.org/MIRCS-Institute/mircs-react/branches)|
|release|[![Build Status](https://travis-ci.org/MIRCS-Institute/mircs-react.svg?branch=release)](https://travis-ci.org/MIRCS-Institute/mircs-react/branches)|

## Development Environment

### Node.js

The build scripts require Node.js to be installed - https://nodejs.org/. As Node.js updates frequently and different projects sometimes require specific versions to be installed, it is recommended that Node Version Manager be installed to switch between them - https://github.com/creationix/nvm.

Node.js ships with a tool called Node Package Manager (npm) - https://www.npmjs.com/ - which is required to run the build tools.

## Running Locally

You'll need to run two shells, one for the client UI and one for the server.

### Server

```sh
cd server
npm install
npm start
```

For more information, see the [Server readme](./server/README.md).

### Client UI

```sh
cd react-app
npm install
npm run watch
```

For more information, see the [React App readme](./react-app/README.md).
