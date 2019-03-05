import { NavLink } from 'react-router-dom'
import { Path } from '../../app/App'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import blue from '@material-ui/core/colors/blue'
import ExtensionIcon from '@material-ui/icons/Extension'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PageSkeleton from '../../components/PageSkeleton'
import React from 'react'
import VignetteIcon from '@material-ui/icons/Vignette'
import WeekendIcon from '@material-ui/icons/Weekend'

const Manage = () => (<PageSkeleton title='Manage'>
  <List>
    <NavMenuItem
      route={Path.manageDataSets()}
      icon={<ExtensionIcon />}
      text='Data Sets'
    />
    <NavMenuItem
      route={Path.manageRelationships()}
      icon={<WeekendIcon />}
      text='Relationships'
    />
    <NavMenuItem
      route={Path.manageViews()}
      icon={<VignetteIcon />}
      text='Views'
    />
  </List>
</PageSkeleton>)

const navMenuItemStyle = {
  navLink: {
    textDecoration: 'none',
    color: 'black',
  },
  selectedNavLink: {
    color: blue[400],
  },
}

const NavMenuItem = withRouter(({ exact, location, route, text, icon }) => {
  let isSelected
  if (exact) {
    isSelected = location.pathname === route
  } else {
    isSelected = _.startsWith(location.pathname, route)
  }

  return (
    <NavLink to={route} style={navMenuItemStyle.navLink} activeStyle={navMenuItemStyle.selectedNavLink}>
      <ListItem button>
        <ListItemIcon style={ isSelected ? navMenuItemStyle.selectedNavLink : {} }>
          {icon}
        </ListItemIcon>
        <ListItemText style={isSelected ? {} : navMenuItemStyle.navLink} primary={text} disableTypography/>
      </ListItem>
    </NavLink>
  )
})

export default Manage
