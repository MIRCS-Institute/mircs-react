import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react'

//
// Displays a confirmation dialog for a deletion, requiring the user to type 'delete' as confirmation
//
const ConfirmDeleteDialog = observer(class extends React.Component {
  static propTypes = {
    // optional name of the item to delete
    name: PropTypes.string,
    // called when the dialog is dismissed
    onCancel: PropTypes.func.isRequired,
    // called once the confirmation string has been entered and the user clicks the Delete button
    onConfirm: PropTypes.func.isRequired
  }

  constructor() {
    super();
    extendObservable(this, {
      confirmFieldValue: ''
    });
  }

  handleTextChange = action((event) => {
    this.confirmFieldValue = event.target.value;
  })

  isDeleteDisabled = () => (this.confirmFieldValue !== 'delete')

  render() {
    return (
      <Dialog open={true} onClose={this.props.onCancel} disableBackdropClick>
        <DialogTitle>Delete {this.props.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To delete {this.props.name} enter "delete" below:
          </DialogContentText>
          <TextField autoFocus margin='dense' id='delete' label='enter "delete"' type='text' fullWidth
                value={this.confirmFieldValue} onChange={this.handleTextChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.props.onConfirm} color='secondary' disabled={this.isDeleteDisabled()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
})

export default ConfirmDeleteDialog;