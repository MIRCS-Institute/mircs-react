import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import PageSkeleton from '../components/PageSkeleton'
import React from 'react'
import SignedInUser from '../states/SignedInUser'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Validator from 'validator'

const SignIn = observer(class extends React.Component {
  constructor() {
    super()
    extendObservable(this, {
      email: '',
      password: '',
      error: null,
    })
  }
  handleEmailChange = action((event) => {
    this.email = event.target.value
    this.error = null
  })
  handlePasswordChange = action((event) => {
    this.password = event.target.value
    this.error = null
  })
  handleSignIn = action(async (event) => {
    event.preventDefault()
    try {
      await SignedInUser.signIn(this.email, this.password)
      // changing the SignedInUser state triggers App to show different content
    } catch(exception) {
      action(() => {
        this.error = exception
      })()
    }
  })
  isSubmitDisabled = () => {
    return !(Validator.isEmail(this.email) && this.password.length)
  }
  render() {
    return (
      <PageSkeleton
        title='Sign In'
      >
        <form onSubmit={this.handleSignIn}>
          <TextField
            autoFocus
            margin='dense'
            label='Email'
            autoComplete='email'
            type='text'
            fullWidth
            value={this.email}
            onChange={this.handleEmailChange}
          />
          <TextField
            margin='dense'
            label='Password'
            autoComplete='current-password'
            type='password'
            fullWidth
            value={this.password}
            onChange={this.handlePasswordChange}
          />
          {this.error && <Typography style={{ color: 'red' }}>
            {`${this.error}`}
          </Typography>}
          <Button
            variant='contained'
            type='submit'
            disabled={this.isSubmitDisabled()}
          >
            Submit
          </Button>
        </form>
      </PageSkeleton>
    )
  }
})

export default SignIn
