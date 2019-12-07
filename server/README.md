# MIRCS Express.js Server

## Running the server locally

```sh
npm install
npm start

# to see more debug output set the DEBUG flag:
DEBUG=true npm start
```

## MongoDB

To install MongoDB on Mac and have it run as a background service:

```sh
brew install mongodb
brew services start mongodb
```

or on Linux:

```sh
sudo apt-get install -y mongodb-org
sudo service mongod start
```

Note that the service will restart when you log in. To quit the service:

```sh
brew services stop mongodb
```

or on Linux:

```sh
sudo service mongod stop
```

## User management

For the time being, a signed in user has full control of the system. Users are not created in the app. Instead we create them with a script which has access to the database. In time this will change, of course.

### Create a user

```sh
node bin/create-user.js [email] [password]
```

### Change a user's password

```sh
node bin/update-password.js [email] [password]
```
