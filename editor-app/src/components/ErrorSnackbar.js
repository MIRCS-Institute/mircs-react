import _ from 'lodash'
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton'
import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import {action, extendObservable} from 'mobx'
import {observer} from 'mobx-react'

//
// Displays an error message to the user as a material snackbar.
//
const ErrorSnackbar = observer(class extends React.Component {
    updateProps = (nextProps) => {
        if (nextProps.error && nextProps.error !== this.error) {
            action(() => {
                let errorMessage = '' + nextProps.error;
                if (errorMessage === '[object Object]') {
                    errorMessage = _.get(nextProps.error, 'error', JSON.stringify(nextProps.error));
                }

                this.error = nextProps.error;
                this.errorMessage = errorMessage;
                this.open = !!nextProps.error;

                if (this.open) {
                    console.error('ErrorSnackbar received error:', nextProps.error);
                }
            })();
        }
    }
    handleErrorClose = action(() => {
        this.open = false;
    })

    constructor(props) {
        super();
        extendObservable(this, {
            errorMessage: null,
            open: false
        });
        this.updateProps(props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateProps(nextProps);
    }

    render() {
        return (
            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'left',}}
                open={this.open}
                autoHideDuration={30000}
                onRequestClose={this.handleErrorClose}
                SnackbarContentProps={{'aria-describedby': 'message-id',}}
                message={<span id="message-id">{'' + this.errorMessage}</span>}
                action={[
                    <IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleErrorClose}>
                        <CloseIcon/>
                    </IconButton>
                ]}
            />
        );
    }
});

export default ErrorSnackbar;