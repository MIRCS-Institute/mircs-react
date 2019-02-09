import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import _ from 'lodash'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import PropTypes from 'prop-types'
import React from 'react'

const IconButtonMenu = observer(class extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    icon: PropTypes.node,
    children: PropTypes.any.isRequired,
  }
  static defaultProps = {
    id: 'menu-id',
    icon: <Icon>menu</Icon>,
  }
  constructor() {
    super()
    extendObservable(this, {
      anchorEl: null,
    })
  }
  handleOpen = event => {
    this.setAnchorEl(event.currentTarget)
  }
  handleClose = () => {
    this.setAnchorEl(null)
  }
  setAnchorEl = action((anchorEl) => {
    this.anchorEl = anchorEl
  })
  closeMenu() {
    this.setAnchorEl(null)
  }
  render() {
    const open = Boolean(this.anchorEl)
    const menuProps = _.omit(this.props, 'icon')

    return (
      <React.Fragment>
        <IconButton
          aria-owns={open ? this.props.id : null}
          aria-haspopup='true'
          onClick={this.handleOpen}
          color='inherit'
        >
          {this.props.icon}
        </IconButton>
        <Menu
          {...menuProps}
          anchorEl={this.anchorEl}
          open={open}
          onClose={this.handleClose}
        >
          {this.props.children}
        </Menu>
      </React.Fragment>
    )
  }
})

export default IconButtonMenu
