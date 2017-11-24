import Grid from 'material-ui/Grid'
import React from 'react';
import {CircularProgress} from 'material-ui/Progress'

const LoadingSpinner = ({title}) => (
    <div>
        <Grid container justify='center'>
            <header style={styles.loadingHeader}>
                {title}
            </header>
        </Grid>
        <Grid container justify='center'>
            <CircularProgress/>
        </Grid>
    </div>
);

const styles = {
    loadingHeader: {
        marginBottom: 24
    }
};

export default LoadingSpinner;