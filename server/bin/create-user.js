const bcrypt = require('bcrypt')
const validator = require('validator')
const DataUtil = require('../src/utils/data-util.js')

if (process.argv.length !== 4) {
  printUsage()
}

const PASSWORD_MIN_LENGTH = 5
const PASSWORD_MAX_LENGTH = 70
const SALT_ROUNDS = 10

const createUser = async () => {
  const email = process.argv[2]
  if (!validator.isEmail(email)) {
    console.error(`'${email}' is not a valid email address`)
    printUsage()
  }

  const password = process.argv[3]
  if (password.length < PASSWORD_MIN_LENGTH) {
    console.error(`password is too short - must have at least ${PASSWORD_MIN_LENGTH} characters`)
    printUsage()
  }
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    console.error(`password is too long - must have fewer than ${PASSWORD_MAX_LENGTH} characters`)
    printUsage()
  }

  await DataUtil.initialize()

  const db = await DataUtil.getDb()
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    await db.collection(DataUtil.AUTHENTICATION_COLLECTION).insertOne({
      createdAt: new Date(),
      updatedAt: new Date(),
      email,
      hash,
    })
  } catch (exception) {
    console.error('Error creating user: \n\n', exception)
  }
}

createUser()

function printUsage() {
  console.log('')
  console.log('Usage: node creaate-user.js <email> <password>')
  console.log('')
  console.log('Creates an authenticated user in the MIRCS database.')
  console.log('')

  // eslint-disable-next-line no-process-exit
  process.exit(1)
}
