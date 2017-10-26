# MIRCS React

This repository contains the mircs-geogenealogy service prototype, built as a React web app connected to an ExpressJS server backed by MongoDB.

# Dev Setup

## Environment

### Node.js

The build scripts require Node.js to be installed - https://nodejs.org/. As Node.js updates frequently and different projects sometimes require specific versions to be installed, it is recommended that Node Version Manager be installed to switch between them - https://github.com/creationix/nvm.

Node.js ships with a tool called Node Package Manager (npm) - https://www.npmjs.com/ - which is required to run the build tools.

## Running Locally

You'll need to run two shells, one for the client UI and one for the server.

### Server:

```bash
$ cd server
$ npm install
$ npm start
```

### Client UI:

```bash
$ cd react-app
$ npm install
$ npm start
```