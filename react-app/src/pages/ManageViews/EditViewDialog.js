import { action, extendObservable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import { refreshView } from '../../api/refreshView'
import { showSnackbarMessage } from '../../components/SnackbarMessages'
import Button from '@material-ui/core/Button'
import ButtonProgress from '../../components/ButtonProgress'
import CardMedia from '@material-ui/core/CardMedia'
import Checkbox from '@material-ui/core/Checkbox'
import ChooseImageDialog from './ChooseImageDialog'
import copyDataPropHOC from '../../components/copyDataPropHOC'
import DataSetChooser from '../../components/DataSetChooser'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ensureString from '../../utils/ensureString'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import MapTileLayers from '../../resources/temp-map-tile-layers/MapTileLayers'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import React from 'react'
import ServerHttpApi from '../../api/net/ServerHttpApi'
import TextField from '@material-ui/core/TextField'
import ViewPictures from '../../resources/temp-view-pictures/ViewPictures'

const EditViewDialog = observer(class extends React.Component {
  static propTypes = {
    // optional - specify the view object to modify in the case of edit, can be undefined for view creation
    data: PropTypes.object,
    // called when the edit dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called after the save completes
    afterSave: PropTypes.func.isRequired,
    open: PropTypes.bool,
  }

  constructor() {
    super()
    extendObservable(this, {
      isSaving: false,
      showChooseImageDialog: false,
    })
  }

  get isCreate() {
    return !this.props.data._id
  }

  // creates a change handler function for the field with passed @key
  handleFieldChange = (key) => {
    return action((event) => {
      if (event.target.type === 'checkbox') {
        this.props.data[key] = !this.props.data[key]
      } else {
        this.props.data[key] = event.target.value
      }
    })
  }

  handleSave = action(() => {
    this.isSaving = true
    this.doSave()
      .then(() => {
        return refreshView(this.props.data._id)
      })
      .then(action(() => {
        this.isSaving = false
        this.props.afterSave()
      }))
      .catch(showSnackbarMessage)
      .then(action(() => {
        this.isSaving = false
      }))

  })

  doSave() {
    const bodyJson = toJS(this.props.data)
    if (this.isCreate) {
      return ServerHttpApi.jsonPost('/api/views', bodyJson)
    } else {
      return ServerHttpApi.jsonPut(`/api/views/${this.props.data._id}`, bodyJson)
    }
  }

  canSave = () => {
    if (!this.props.data.name) {
      return false
    }
    return true
  }

  render() {
    const { open, onCancel } = this.props

    return (
      <Dialog open={open} fullWidth={true}>
        <DialogTitle>{this.isCreate ? 'Create View' : 'Edit View'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label='name'
            value={this.props.data.name || ''}
            onChange={this.handleFieldChange('name')}
            margin='dense' type='text' fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox checked={this.props.data.showOnHome} onChange={this.handleFieldChange('showOnHome')} />
            }
            label='Show on Home Page'
          />

          <TextField
            label='description'
            value={this.props.data.description || ''}
            onChange={this.handleFieldChange('description')}
            margin='dense' type='text' fullWidth
          />

          <DataSetChooser
            label='Data Set'
            dataSetId={this.props.data.dataSetId}
            onDataSetChanged={action((dataSetId) => this.props.data.dataSetId = dataSetId)}
          />

          <TextField
            select
            label='Tile Layer'
            value={this.props.data.tileLayerName || ''}
            onChange={action((event) => {
              this.props.data.tileLayerName = event.target.value
            })}
            margin='normal'
            variant='outlined'
          >
            {Object.keys(MapTileLayers.layers).map((key) =>
              <MenuItem key={key} value={key}>
                {MapTileLayers.layers[key].name}
              </MenuItem>
            )}
          </TextField>

          {this.props.data.image &&
            <CardMedia
              image={ViewPictures.getPictureUrl(this.props.data.image)}
              title={this.props.data.image.name}
              style={{ height: 140 }}
            />
          }
          <Button onClick={action(() => this.showChooseImageDialog = true)}>
            Choose Image
          </Button>
          <ChooseImageDialog
            open={this.showChooseImageDialog}
            value={this.props.data.image}
            onChange={action((image) => this.props.data.image = image)}
            onDismiss={action(() => this.showChooseImageDialog = false)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color='primary' disabled={this.isSaving}>
            Cancel
          </Button>
          <Button onClick={this.handleSave} color='secondary' disabled={!this.canSave()}>
            Save
            {this.isSaving && <ButtonProgress/>}
          </Button>
        </DialogActions>

      </Dialog>
    )
  }
})

export default copyDataPropHOC(EditViewDialog, {
  processCopy: (viewCopy) => {
    ensureString(viewCopy, 'name')
    ensureString(viewCopy, 'description')
    ensureString(viewCopy, 'dataSetId')
  },
})
