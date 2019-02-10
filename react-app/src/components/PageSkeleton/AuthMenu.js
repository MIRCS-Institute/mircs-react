import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Divider from '@material-ui/core/Divider'
import IconButtonMenu from '../IconButtonMenu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import SignedInUser from '../../states/SignedInUser'

const AuthMenu = observer(class extends React.Component {
  constructor() {
    super()
    this.menuRef = React.createRef()
  }
  handleSignOut = () => {
    this.menuRef.current.closeMenu()
    SignedInUser.signOut()
  }
  render() {
    const { classes } = this.props

    return (
      <IconButtonMenu
        ref={this.menuRef}
        icon={<AccountCircle/>}
        id='authmenu-mainappbar'
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <ListItemText primary={SignedInUser.get('email')}/>
          </ListItem>
        </List>
        <Divider/>
        <MenuItem onClick={this.handleSignOut}>Sign Out</MenuItem>
      </IconButtonMenu>
    )
  }
})

const styles = theme => {
  return {
    list: {
      outline: 'none',
    },
    listItem: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  }
}

export default withStyles(styles)(AuthMenu)
