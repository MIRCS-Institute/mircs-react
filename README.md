# MIRCS React

This repository contains a React-based front-end for the mircs-geogenealogy server. At this point it does not connect to the server, but is instead a playground for user interface paradigms.

# Dev Setup

## Environment

### Node.js

The build scripts require Node.js to be installed - https://nodejs.org/. As Node.js updates frequently and different projects sometimes require specific versions to be installed, it is recommended that Node Version Manager be installed to switch between them - https://github.com/creationix/nvm.

Node.js ships with a tool called Node Package Manager (npm) - https://www.npmjs.com/ - which is required to run the build tools.

### create-react-app

The basic structure of this project was created with the create-react-app script provided by Facebook - https://github.com/facebookincubator/create-react-app. It installs a fairly opinionated environment based on Facebook's experience with their own React framework and represents the efforts of many smart people. I am grateful to their efforts and appreciate our ability to leverage it. To that end, I do not want us to "eject" and modify the environment. We can do things the "React way" and wrap to extend.

For more information on React see Facebook's developer pages - https://facebook.github.io/react/docs/hello-world.html

## Running

To set up a development environment, in this directory run:

```sh
npm install
npm start
```

To run the test watcher in an interactive mode (by default, runs tests related to files changed since the last commit):

```sh
npm test
```

To build the app for production to the `build` folder:

```sh
npm run build
```
