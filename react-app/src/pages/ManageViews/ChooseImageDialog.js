import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import CardMedia from '@material-ui/core/CardMedia'
import copyDataPropHOC from '../../components/copyDataPropHOC'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ensureString from '../../utils/ensureString'
import PropTypes from 'prop-types'
import React from 'react'
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
    const { open, onChange, onDismiss } = this.props

    return (
      <Dialog open={open} disableEnforceFocus>
        <DialogTitle>Choose Image</DialogTitle>
        <DialogContent>
          {ViewPictures.getPicturesList().map((picture, index) =>
            <div key={index} onClick={() => { onChange(picture); onDismiss() }}>
              <CardMedia
                image={ViewPictures.getPictureUrl(picture)}
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
            Cancel
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
