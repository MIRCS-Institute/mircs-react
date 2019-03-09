import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Path } from '../../app/App'
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
        <List style={{ outline: 'none' }}>
          <ListItem style={{ paddingLeft: 16, paddingRight: 16 }}>
            <ListItemText primary={SignedInUser.get('email')}/>
          </ListItem>
        </List>
        <Divider/>
        <NavLink to={Path.manageRoot()} style={{ textDecoration: 'none' }}>
          <MenuItem>Manage</MenuItem>
        </NavLink>
        <MenuItem onClick={this.handleSignOut}>Sign Out</MenuItem>
      </IconButtonMenu>
    )
  }
})

export default AuthMenu
