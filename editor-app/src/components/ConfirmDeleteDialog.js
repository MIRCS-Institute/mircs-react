import Button from 'material-ui/Button'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import {action, extendObservable} from 'mobx'
import {observer} from 'mobx-react'

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
    handleTextChange = action((event) => {
        this.confirmFieldValue = event.target.value;
    })
    isDeleteDisabled = () => (this.confirmFieldValue !== 'delete')

    constructor() {
        super();
        extendObservable(this, {
            confirmFieldValue: ''
        });
    }

    render() {
        return (
            <Dialog open={true} onRequestClose={this.props.onCancel} ignoreBackdropClick>
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
                    <Button onClick={this.props.onConfirm} color='accent' disabled={this.isDeleteDisabled()}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
})

export default ConfirmDeleteDialog;