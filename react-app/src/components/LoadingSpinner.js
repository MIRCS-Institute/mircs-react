import Grid from '@material-ui/core/Grid'
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    marginTop: 12,
    marginBottom: 24
  }
};

export default LoadingSpinner;