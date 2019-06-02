import CardMedia from '@material-ui/core/CardMedia'
import { action, extendObservable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import { refreshView } from '../../api/refreshView'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import Button from '@material-ui/core/Button'
import ButtonProgress from '../../components/ButtonProgress'
import copyDataPropHOC from '../../components/copyDataPropHOC'
import DataSetChooser from '../../components/DataSetChooser'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ensureString from '../../utils/ensureString'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ViewPictures from '../../resources/temp-view-pictures/ViewPictures'

const ChooseImageDialog = observer(class extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    extendObservable(this, {
    })
  }

  render() {
    const { open, value, onChange, onDismiss } = this.props

    const valueUrl = value && value.url

    console.log(ViewPictures.getPicturesList())

    return (
      <Dialog open={open} disableEnforceFocus>
        <DialogTitle>Choose Image</DialogTitle>
        <DialogContent>
          {ViewPictures.getPicturesList().map((picture, index) =>
            <div key={index} onClick={() => onChange(picture)}>
              <CardMedia
                image={picture.url}
                title={picture.name}
                style={{ height: 140 }}
              />
              <Typography>
                {picture.name}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onDismiss}>
            OK
          </Button>
        </DialogActions>

      </Dialog>
    )
  }
})

export default copyDataPropHOC(ChooseImageDialog, {
  processCopy: (viewCopy) => {
    ensureString(viewCopy, 'name')
    ensureString(viewCopy, 'description')
    ensureString(viewCopy, 'dataSetId')
  },
})
