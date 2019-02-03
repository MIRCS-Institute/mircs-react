import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import amber from '@material-ui/core/colors/amber'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import classNames from 'classnames'
import CloseIcon from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'
import getErrorMessage from '../utils/getErrorMessage'
import green from '@material-ui/core/colors/green'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import PropTypes from 'prop-types'
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'

export const LEVEL_SUCCESS = 'success'
export const LEVEL_INFO = 'info'
export const LEVEL_WARNING = 'warning'
export const LEVEL_ERROR = 'error'

const DEFAULT_TIME_MILLIS = 30 * 1000

export const showSnackbarMessage = action((text, level=LEVEL_ERROR, timeToDisplay=DEFAULT_TIME_MILLIS) => {
  if (typeof text !== 'string') {
    text = getErrorMessage(text)
  }

  const id = _lastSnackbarId++
  _snackbarMessages.push({
    text,
    level,
    id,
    icon: levelIcon[level],
  })

  setTimeout(action(() => {
    _.remove(_snackbarMessages, { id })
  }), timeToDisplay)
})

// clears all snackbar messages
export const clearSnackbarMessages = action(() => {
  _snackbarMessages.clear()
})

const _snackbarMessages = observable([])
let _lastSnackbarId = 0

const levelIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const SnackbarMessages = observer(class extends React.Component {
  render() {
    if (!_snackbarMessages.length) {
      return null
    }
    return (<Snackbar open={true}>
      <div>
        {_snackbarMessages.map((snackbarMessage) => (
          <SnackbarMessage key={snackbarMessage.id} snackbarMessage={snackbarMessage}/>
        ))}
      </div>
    </Snackbar>)
  }
})

const snackbarMessageStyles = (theme) => {
  return {
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },

    message: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing.unit,
    },
    margin: {
      margin: theme.spacing.unit,
    },
  }
}

const SnackbarMessage = withStyles(snackbarMessageStyles)(class extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    snackbarMessage: PropTypes.object.isRequired,
  }
  handleClose = action(() => {
    _snackbarMessages.remove(this.props.snackbarMessage)
  })
  render() {
    const { classes, snackbarMessage } = this.props

    const messageId = `message-id-${snackbarMessage.id}`
    const Icon = levelIcon[snackbarMessage.level]

    return <SnackbarContent
      className={classNames(classes[snackbarMessage.level], classes.margin)}
      aria-describedby={messageId}
      message={
        <span id={messageId} className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {snackbarMessage.text}
        </span>
      }
      action={[
        <IconButton
          key='close'
          aria-label='Close'
          color='inherit'
          className={classes.close}
          onClick={this.handleClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
    />
  }
})

export default SnackbarMessages
