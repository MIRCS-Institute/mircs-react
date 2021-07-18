import { NavLink } from 'react-router-dom'
import { observer } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import AuthMenu from './AuthMenu'
import Layout from '../../utils/Layout'
import MircsLogoWhite from '../../resources/MircsLogoWhite'
import PropTypes from 'prop-types'
import React from 'react'
import SignedInUser from '../../states/SignedInUser'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Path } from '../../app/App'

const PageSkeleton = observer(class extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  }

  render() {
    const { title, children } = this.props

    return (<React.Fragment>
      <AppBar>
        <Toolbar disableGutters={true} style={{ paddingRight: 8 }}>
          <NavLink to={Path.home()} style={{ textDecoration: 'none' }}>
            <MircsLogoWhite alt='MIRCS Logo' style={{ height: 36, paddingLeft: 8, paddingRight: 12 }}/>
          </NavLink>

          <Typography variant='h4' color='inherit' noWrap>
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
