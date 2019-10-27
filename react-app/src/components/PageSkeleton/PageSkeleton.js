import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Path } from '../../app/App'
import AppBar from '@material-ui/core/AppBar'
import AuthMenu from './AuthMenu'
import HomeIcon from '@material-ui/icons/Home'
import Layout from '../../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import SignedInUser from '../../states/SignedInUser'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

const PageSkeleton = observer(class extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  }

  render() {
    const { title, children } = this.props

    return (<React.Fragment>
      <AppBar>
        <Toolbar disableGutters={true} style={{ paddingRight: 8 }}>
          <NavLink to={Path.home()} style={{ textDecoration: 'none', padding: '0 20px' }}>
            <Tooltip title='Return to Prototype Home' aria-label='Return to Prototype Home'>
              <HomeIcon color='secondary' fontSize='large' />
            </Tooltip>
          </NavLink>

          <Typography variant='title' color='inherit' noWrap>
            {title || 'MIRCS Geo-Genealogy'}
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

export default PageSkeleton
