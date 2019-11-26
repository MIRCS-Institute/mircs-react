import { observer } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import AuthMenu from './AuthMenu'
import Layout from '../../utils/Layout'
import MircsLogo from '../../resources/mircs-logo-white.svg'
import PropTypes from 'prop-types'
import React from 'react'
import SignedInUser from '../../states/SignedInUser'
import Toolbar from '@material-ui/core/Toolbar'
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
          <img src={MircsLogo} alt='MIRCS Logo' style={{ height: 36, paddingLeft: 8, paddingRight: 12 }}/>

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
