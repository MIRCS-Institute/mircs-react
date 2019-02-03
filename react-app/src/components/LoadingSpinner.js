import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import React from 'react'

const LoadingSpinner = ({ title }) => (
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
)

LoadingSpinner.propTypes = {
  title: PropTypes.string,
}

const styles = {
  loadingHeader: {
    marginTop: 12,
    marginBottom: 24,
  },
}

export default LoadingSpinner
