import { action, extendObservable } from 'mobx'
import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Path } from '../../app/App'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import AppBar from '@material-ui/core/AppBar'
import AuthMenu from './AuthMenu'
import blue from '@material-ui/core/colors/blue'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Drawer from '@material-ui/core/Drawer'
import ExtensionIcon from '@material-ui/icons/Extension'
import HomeIcon from '@material-ui/icons/Home'
import IconButton from '@material-ui/core/IconButton'
import Layout from '../../utils/Layout'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import PropTypes from 'prop-types'
import React from 'react'
import SignedInUser from '../../states/SignedInUser'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import WeekendIcon from '@material-ui/icons/Weekend'

const PageSkeleton = observer(class extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  }

  constructor() {
    super()
    extendObservable(this, {
      isDrawerOpen: false,
    })
  }

  toggleDrawerOpen = action(() => {
    this.isDrawerOpen = !this.isDrawerOpen
  })

  render() {
    const { title, children } = this.props

    return (<React.Fragment>
      <Drawer open={this.isDrawerOpen} onClose={this.toggleDrawerOpen}>
        <SideMenu toggleDrawerOpen={this.toggleDrawerOpen}/>
      </Drawer>

      <AppBar>
        <Toolbar disableGutters={true} style={{ paddingRight: 8 }}>
          <IconButton color='inherit' aria-label='open drawer' onClick={this.toggleDrawerOpen}>
            <MenuIcon/>
          </IconButton>
          <Typography variant='title' color='inherit' noWrap>
            {title || 'MIRCS Geogenealogy'}
          </Typography>
          <div style={{ flex: 1 }}/>
          <div>
            {SignedInUser.isSignedIn() && <AuthMenu/>}
          </div>
        </Toolbar>
      </AppBar>

      <div style={{ ...Layout.absoluteFill, marginTop: 66, padding: 5 }}>
        {children}
      </div>

    </React.Fragment>)
  }
})

const SideMenu = ({ toggleDrawerOpen }) => (<List>
  <div><IconButton onClick={toggleDrawerOpen}><ChevronLeftIcon /></IconButton></div>

  <NavMenuItem
    route={Path.home()}
    exact
    text='Home'
    icon={<HomeIcon />}
    toggleDrawerOpen={toggleDrawerOpen}
  />
  <NavMenuItem
    route={Path.dataSets()}
    text='Data Sets'
    icon={<ExtensionIcon />}
    toggleDrawerOpen={toggleDrawerOpen}
  />
  <NavMenuItem
    route={Path.relationships()}
    text='Relationships'
    icon={<WeekendIcon />}
    toggleDrawerOpen={toggleDrawerOpen}
  />
</List>)

SideMenu.propTypes = {
  toggleDrawerOpen: PropTypes.func,
}

const navMenuItemStyle = {
  navLink: {
    textDecoration: 'none',
    color: 'black',
  },
  selectedNavLink: {
    color: blue[400],
  },
}

const NavMenuItem = withRouter(({ exact, location, route, text, toggleDrawerOpen, icon }) => {
  let isSelected
  if (exact) {
    isSelected = location.pathname === route
  } else {
    isSelected = _.startsWith(location.pathname, route)
  }

  return (
    <NavLink to={route} style={navMenuItemStyle.navLink} activeStyle={navMenuItemStyle.selectedNavLink}>
      <ListItem button onClick={toggleDrawerOpen}>
        <ListItemIcon style={ isSelected ? navMenuItemStyle.selectedNavLink : {} }>
          {icon}
        </ListItemIcon>
        <ListItemText style={isSelected ? {} : navMenuItemStyle.navLink} primary={text} disableTypography/>
      </ListItem>
    </NavLink>
  )
})

export default PageSkeleton
